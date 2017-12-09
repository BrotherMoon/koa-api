const validator = require('validator')
const _ = require('lodash')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const uuidv1 = require('uuid/v1')
const userModel = require('../models/user.model')
const blogModel = require('../models/blog.model')
const config = require('../../config')
const U_E = require('../utils/const').USER_ERROR
const C_E = require('../utils/const').COMMON_ERROR
const helper = require('../utils/helper')
const qn = require('../utils/qn')
const fs = require('fs')
module.exports = {
  // 查找所有用户
  findUsers: async ctx => {
    const data = await userModel.find({}, {password: 0})
    ctx.success({data})
  },
  // 根据用户id查找用户
  findUser: async ctx => {
    const {id} = ctx.params
    // 检测是否是合法的objectid
    if (!validator.isMongoId(id)) {
      return ctx.error({msg: C_E.INVALID_MONGOID[0], code: C_E.INVALID_MONGOID[1]})
    }
    const data = await userModel.findOne({_id: id}, {password: 0})
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
      argError = U_E.ILLEGAL_NAME[0]
    } else if (!email) {
      argError = 'missing email'
    } else if (!validator.isEmail(email)) {
      argError = U_E.ILLEGAL_EMAIL[0]
    }
    if (argError)
      return ctx.error({msg: argError, code: C_E.ILLEGAL_PARAMETER[1]})
    // 根据name查找是否已经存在该用户名
    const namedUser = await userModel.findOne({name})
    if (!_.isEmpty(namedUser))
      return ctx.error({msg: U_E.USER_EXISTS[0], code: U_E.USER_EXISTS[1]})
    // 根据email查看该邮箱是否已经被注册使用
    const mailedUser = await userModel.findOne({email})
    if (!_.isEmpty(mailedUser))
      return ctx.error({msg: U_E.EMAIL_USED[0], code: U_E.EMAIL_USED[1]})
    // 生成由6位随机数字组成的字符串作为初始密码
    const initPwd = _.sampleSize([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 6).join('')
    // 创建用户
    const newUser = new userModel({name, password: initPwd, email})
    // 将用户信息插入数据库
    let data = await newUser.save()
    data = _.omit(data.toJSON(), 'password')
    if (data) {
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
    // 根据name查找用户, 设置lean: true可以把mongoose包装返回的不可修改对象转换为一个可修改的object
    let data = await userModel.findOne({email}, null, {lean: true})
    if (!data)
      return ctx.error({msg: 'user not found', code: 1003, status: 400})
    if (data.password !== password)
      return ctx.error({msg: U_E.WRONG_PASSWORD[0], code: U_E.WRONG_PASSWORD[1]})
    // 删除password属性，防止密码泄露
    data = _.omit(data, 'password')
    // 创建并返回后续用于请求验证的token以及用户信息
    const token = jwt.sign({
      _id: data._id
    }, config.tokenSecret, {
      expiresIn: config.expiresIn
    })
    Object.assign(data, {token})
    ctx.success({data})
  },
  // 更新用户信息
  updateUser: async ctx => {
    const userId = ctx._id
    const {password, active, profile, avatar, oldPassword} = ctx.request.body
    // 检测是否是合法的objectid
    if (!validator.isMongoId(userId)) {
      return ctx.error({msg: C_E.INVALID_MONGOID[0], code: C_E.INVALID_MONGOID[1]})
    }
    // 参数校验
    let argError = ''
    if (password) {
      if ((!_.isString(password) || password.trim().length < 6)) {
        argError = U_E.ILLEGAL_PASSWORD[0]
      }
   } else if (active && _.isNil([0, 1].find(num => num == active))) {
     argError =  U_E.ILLEGAL_ACTIVE[0]
   } else if (profile && profile.trim().length > 30) {
     argError = U_E.ILLEGAL_PROFILE[0]
   }
    if (argError)
      return ctx.error({msg: argError, code: 1002})
    // 如果是修改密码则先进行旧密码校验
    if (password) {
      const target = await userModel.findOne({_id: userId})
      if (oldPassword !== target.password) {
        return ctx.error({msg: U_E.WRONG_PASSWORD[0], code: U_E.WRONG_PASSWORD[1]})
      }
    }
    let updateStr = {password, active, profile, avatar}
    // 剔除没有传入的参数
    updateStr = _.omitBy(updateStr, _.isNil)
    // {new: true}表示更新成功后会返回更新后的信息，默认为false
    const data = await userModel.findByIdAndUpdate(userId, updateStr, {new: true, lean: true})
    !_.isEmpty(data) ? ctx.success({status: 202, data: _.omit(data, 'password')}) : ctx.error({status: 400, code: 1007, msg: 'update failed'})
  },
  // 删除用户
  deleteUser: async ctx => {
    const {userId} = ctx.params
    // 检测是否是合法的objectid
    if (!validator.isMongoId(userId)) {
      return ctx.error({msg: C_E.INVALID_MONGOID[0], code: C_E.INVALID_MONGOID[1]})
    }
    const data = await userModel.findOneAndRemove({_id: userId})
    !_.isEmpty(data) ? ctx.success({status: 204}) : ctx.error({msg: 'user not found', code: 1006, status: 404})
  },
  // 找出该用户的所有博客标签以及对应标签下的博客数量
  findTagsAndBogNum: async ctx => {
    const {userId} = ctx.params
    // 检测是否是合法的objectid
    if (!validator.isMongoId(userId)) {
      return ctx.error({msg: C_E.INVALID_MONGOID[0], code: C_E.INVALID_MONGOID[1]})
    }
    const data = await blogModel.aggregate([
      {$match: {author: mongoose.Types.ObjectId(userId)}},
      {$group: {_id: '$tag', num: {$sum: 1}}}
    ])
    console.log(data)
    // 在结果中查询是否有‘无标签’这一默认标签，若无，填充该集合
    !_.find(data, tag => tag._id === '无标签') && data.push({_id: '无标签', num: 0})
    ctx.success({data})
  },
  // 上传头像
  uploadAvatar: async ctx => {
    const userId = ctx._id
    const {avatar} = ctx.request.body.files
    // 获取文件缓存地址
    const temPath = avatar.path
    // 创建读取流
    const reader = fs.createReadStream(temPath)
    // 上传至七牛
    const newPath = await qn.upload(reader)
    // 将新的头像路径更新至数据库
    const data = await userModel.findByIdAndUpdate(userId, {avatar: newPath}, {new: true, lean: true})
    return !_.isEmpty(data) ? ctx.success({status: 202, data: _.omit(data, 'password')}) : ctx.error({status: 400, code: 1007, msg: 'update failed'})
  },
  // 给已注册的用户邮箱发送登录密码
  sendMailWithPWd: async ctx => {
    const {email} = ctx.params
    const data = await userModel.findOne({email})
    if (!_.isEmpty(data)) {
      const mailId = await helper.sendMail({to: email, p1: `您的密码为 <b>${data.password}</b>`, p2: '^_^....'})
      return ctx.success({data: mailId})
    } else {
      ctx.error({msg: 'user not found', code: 1006, status: 404})
    }
  }
}
