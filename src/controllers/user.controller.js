const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const config = require('../../config')
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
    data.length > 0
      ? ctx.success({data})
      : ctx.error({msg: 'user not found', code: 1001, status: 404})
  },
  // 创建用户
  createUser: async(ctx, next) => {
    const {name, password} = ctx.request.body
    if (!name || !password)
      return ctx.error({msg: 'name and password is required'})
    const newUser = new userModel({name, password})
    const data = await newUser.save()
    ctx.success({data, status: 201})
  },
  // 用户登录
  login: async ctx => {
    const {name, password} = ctx.request.body
    // 校验用户名还有密码
    if (!name || !password)
      return ctx.error({msg: 'name and password is required'})
    // 根据name查找用户
    const data = await userModel.findOne({name})
    if (!data)
      return ctx.error({msg: 'user not found', code: 1001, status: 404})
    if (data.password !== password)
      return ctx.error({msg: 'wrong password', code: 1001, status: 404})
    // 删除password属性，防止密码泄露
    data.password = undefined
    // 创建并返回后续用于请求验证的token以及用户信息
    const token = jwt.sign({
      id: data.id
    }, config.tokenSecret, {expiresIn: 100})
    ctx.success({
      data: {
        user: data,
        token
      }
    })
  }
}
