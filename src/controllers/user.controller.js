const validator = require('validator')
const _ = require('lodash')
const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')
const blogModel = require('../models/blog.model')
const config = require('../../config')
const ERROR_MESSAGE = require('../utils/const')
const helper = require('../utils/helper')
module.exports = {
  // 查找所有用户
  findUsers: async ctx => {
    const data = await userModel.find({}, {password: 0})
    ctx.success({data})
  },
  // 根据用户名查找用户
  findUser: async ctx => {
    const {name} = ctx.params
    const data = await userModel.find({name}, {password: 0})
    ctx.success({data})
  },
  // 创建用户
  createUser: async(ctx, next) => {
    const {name, password, email} = ctx.request.body
    // 校验用户名还有密码
    let argError = ''
    if (!name) {
      argError = 'missing name'
    } else if (!validator.isLength(name.trim(), {min: 3, max: 15})) {
      argError = ERROR_MESSAGE.USER.ILLEGAL_NAME
    } else if (!email) {
      argError = 'missing email'
    } else if (!validator.isEmail(email)) {
      argError = ERROR_MESSAGE.USER.ILLEGAL_EMAIL
    }
    if (argError)
      return ctx.error({msg: argError, code: 1002})
    // 根据name查找是否已经存在该用户名
    const namedUser = await userModel.findOne({name})
    if (!_.isEmpty(namedUser))
      return ctx.error({msg: ERROR_MESSAGE.USER.USER_EXISTS, code: 1005})
    // 根据email查看该邮箱是否已经被注册使用
    const mailedUser = await userModel.findOne({email})
    if (!_.isEmpty(mailedUser))
      return ctx.error({msg: ERROR_MESSAGE.USER.EMAIL_USED, code: 1009})
    // 生成由6位随机数字组成的字符串作为初始密码
    const initPwd = _.sampleSize([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 6).join('')
    // 创建用户
    const newUser = new userModel({name, password: initPwd, email})
    // 将用户信息插入数据库
    let data = await newUser.save()
    if (data) {
      data.password = undefined
      // 发送邮件告知用户初始密码,这里不等待邮件的发送成功,当用户没有收到邮件,前端再次提供用户发送邮件的选择即可
      helper.sendMail({to: email, p1: `您的初始密码为 <b>${initPwd}</b>`, p2: '为了保证您的账号安全,请在登录后及时修改密码并且删除该邮件'})
      return ctx.success({data, status: 201})
    } else {
      return ctx.error({msg: 'create failed', code: 1008})
    }
  },
  // 用户登录
  login: async ctx => {
    const {email, password} = ctx.request.body
    // 根据name查找用户
    let data = await userModel.findOne({email})
    if (!data)
      return ctx.error({msg: 'user not found', code: 1003, status: 400})
    if (data.password !== password)
      return ctx.error({msg: 'wrong password', code: 1004})
    // 删除password属性，防止密码泄露
    data.password = undefined
    // 创建并返回后续用于请求验证的token以及用户信息
    const token = jwt.sign({
      _id: data._id
    }, config.tokenSecret, {
      expiresIn: 60 * 60 * 24
    })
    data.token = token
    ctx.success({data: Object.assign(data._doc, {token})})
  },
  // 更新用户信息
  updateUser: async ctx => {
    const {userId} = ctx.params
    const {password, active, profile, avatar} = ctx.request.body
    // 检测是否是合法的objectid
    if (!validator.isMongoId(userId)) {
      return ctx.error({msg: 'invalid userId', code: 1002, status: 400})
    }
    // 参数校验
    let argError = ''
    if (password && (!_.isString(password) || password.trim().length < 6)) {
     argError = ERROR_MESSAGE.USER.ILLEGAL_PASSWORD
   } else if (active && _.isNil([0, 1].find(num => num == active))) {
     argError =  ERROR_MESSAGE.USER.ILLEGAL_ACTIVE
   } else if (profile && profile.trim().length > 30) {
     argError = ERROR_MESSAGE.USER.ILLEGAL_PROFILE
   }
    if (argError)
      return ctx.error({msg: argError, code: 1002})
    let updateStr = {password, active, profile, avatar}
    // 剔除没有传入的参数
    updateStr = _.omitBy(updateStr, _.isNil)
    // {new: true}表示更新成功后会返回更新后的信息，默认为false
    const data = await userModel.findByIdAndUpdate(userId, updateStr, {new: true})
    !_.isEmpty(data) ? ctx.success({status: 202, data}) : ctx.error({status: 400, code: 1007, msg: 'update failed'})
  },
  // 删除用户
  deleteUser: async ctx => {
    const {userId} = ctx.params
    // 检测是否是合法的objectid
    if (!validator.isMongoId(userId)) {
      return ctx.error({msg: 'invalid userId', code: 1002, status: 400})
    }
    const data = await userModel.findOneAndRemove({_id: userId})
    !_.isEmpty(data) ? ctx.success({status: 204}) : ctx.error({msg: 'user not found', code: 1006, status: 404})
  },
  // 找出该用户的所有博客标签以及对应标签下的博客数量
  findTagsAndBogNum: async ctx => {
    const {userId} = ctx.params
    // 检测是否是合法的objectid
    if (!validator.isMongoId(userId)) {
      return ctx.error({msg: 'invalid userId', code: 1002, status: 400})
    }
    const data = await blogModel.aggregate([
      {$match: {author: userId}},
      {$group: {_id: '$tag', num: {$sum: 1}}}
    ])
    // 在结果中查询是否有‘无标签’这一默认标签，若无，填充该集合
    !_.find(data, tag => tag._id === '无标签') && data.push({_id: '无标签', num: 0})
    ctx.success({data})
  }
}
