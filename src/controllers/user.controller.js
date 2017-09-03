const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const config = require('../../config')
const validator = require('validator')
const isEmpty = require('lodash/fp/isEmpty')
module.exports = {
  // 查找所有用户
  findUsers: async ctx => {
    const data = await userModel.find({}, {password: 0})
    ctx.success({data})
  },
  // 根据用户名查找用户
  findUser: async ctx => {
    const {name} = ctx.params
    const data = await userModel.find({name})
    ctx.success({data})
  },
  // 创建用户
  createUser: async(ctx, next) => {
    const {name, password} = ctx.request.body
    // 校验用户名还有密码
    let argError = ''
    if (!name) {
      argError = 'missing name'
    } else if (!(name.trim().length >= 1 && name.trim().length <= 15)) {
      argError = 'the length of name must between 1 and 15'
    } else if (!password) {
      argError = 'missing password'
    } else if (password.trim().length < 6) {
      argError = 'the password need to have at least 6 characters'
    }
    if (argError)
      return ctx.error({msg: argError, code: 1002})
    // 根据name查找是否已经存在该用户名
    const user = await userModel.findOne({name})
    if (!isEmpty(user))
      return ctx.error({msg: 'user name already exists', code: 1005})
    // 创建用户
    const newUser = new userModel({name, password})
    const data = await newUser.save()
    ctx.success({data, status: 201})
  },
  // 用户登录
  login: async ctx => {
    const {name, password} = ctx.request.body
    // 根据name查找用户
    const data = await userModel.findOne({name})
    if (!data)
      return ctx.error({msg: 'user not found', code: 1003, status: 404})
    if (data.password !== password)
      return ctx.error({msg: 'wrong password', code: 1004})
    // 删除password属性，防止密码泄露
    data.password = undefined
    // 创建并返回后续用于请求验证的token以及用户信息
    const token = jwt.sign({
      id: data.id
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
  // 删除用户
  deleteUser: async ctx => {
    const {userId} = ctx.params
    const data = await userModel.findOneAndRemove({_id: userId})
    if (!isEmpty(data)) {
      ctx.success({status: 204})
    } else {
      ctx.error({msg: 'user not found', status: 404})
    }
  }
}
