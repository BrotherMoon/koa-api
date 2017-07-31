const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
module.exports = {
    findUsers: async ctx => {
        const data = await userModel.find()
        ctx.success({data})
    },
    findUser: async ctx => {
        const {name} = ctx.query
        const data = await userModel.find({'name': name})
        ctx.success({data})
    },
    createUser: async(ctx, next) => {
        const {name, password} = ctx.request.body
        if (!name || !password) return ctx.error({msg: 'name and password is required'})
        const newUser = new userModel({name, password})
        const data = await newUser.save()
        ctx.success({data})
    },
    login: async ctx => {
        const {name, password} = ctx.request.body
        if (!name || !password) return ctx.error({msg: 'name and password is required'})
        const data = await userModel.findOne({name, password}, {password: 0})
        if (!data) return ctx.error({msg: "can't not find the user"})
        const newData = Object.assign(data._doc, {token: jwt.sign({id: data._doc.id}, 'xuwenchao', {expiresIn: '10s'})})
        ctx.success({data: newData})
    }
}
