const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const config = require('../../config')
const validator = require('validator')
const _ = require('lodash')
const ERROR_MESSAGE = require('../helper/const')
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
    const {name, password} = ctx.request.body
    // 校验用户名还有密码
    let argError = ''
    if (!name) {
      argError = 'missing name'
    } else if (!validator.isLength(name.trim(), {min: 0, max: 15})) {
      argError = ERROR_MESSAGE.USER.ILLEGAL_NAME
    } else if (!password) {
      argError = 'missing password'
    } else if (!_.isString(password) || password.trim().length < 6) {
      argError = ERROR_MESSAGE.USER.ILLEGAL_PASSWORD
    }
    if (argError)
      return ctx.error({msg: argError, code: 1002})
    // 根据name查找是否已经存在该用户名
    const user = await userModel.findOne({name})
    if (!_.isEmpty(user))
      return ctx.error({msg: 'user name already exists', code: 1005})
    // 创建用户
    const newUser = new userModel({name, password})
    const data = await newUser.save()
    return data ? ctx.success({data, status: 201}) : ctx.error({msg: 'create failed', code: 1008})
  },
  // 用户登录
  login: async ctx => {
    const {name, password} = ctx.request.body
    // 根据name查找用户
    const data = await userModel.findOne({name})
    if (!data)
      return ctx.error({msg: 'user not found', code: 1003, status: 400})
    if (data.password !== password)
      return ctx.error({msg: 'wrong password', code: 1004})
    // 删除password属性，防止密码泄露
    data.password = undefined
    // 创建并返回后续用于请求验证的token以及用户信息
    const token = jwt.sign({
      _id: data.id
    }, config.tokenSecret, {
      expiresIn: 60 * 60 * 24
    })
    ctx.success({
      data: {
        user: data,
        token
      }
    })
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
    if (!_.isEmpty(data)) {
      ctx.success({status: 204})
    } else {
      ctx.error({msg: 'user not found', code: 1003, status: 400})
    }
  }
}
