const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

module.exports = {
    findUsers: async ctx => {
        const data = await userModel.find();
        ctx.success({data, msg: '获取所有用户信息成功'});
    },
    findUser: async ctx => {
        const name = ctx.params.name;
        const data = await userModel.find({'name': name});
        ctx.success({data, msg: '查询用户信息成功'});
    },
    createUser: async(ctx, next) => {
        const {name, password} = ctx.request.body;
        console.log(typeof password); 
        if (!name || !password) return ctx.error({msg: '用户名还有密码不能为空'});
        const newUser = new userModel({name, password});
        const data = await newUser.save();
        ctx.success({data, msg: '创建用户成功'});
    },
    login: async ctx => {
        const {name, password} = ctx.request.body;
        if (!name || !password) return ctx.error({msg: '用户名还有密码不能为空'});
        const data = await userModel.findOne({name, password}, {password: 0});
        if (!data) return ctx.error({msg: '请输入正确的用户名还有密码'});
        const newData = Object.assign(data._doc, {token: jwt.sign({id: data._doc.id}, 'xuwenchao', {expiresIn: '10s'})});
        ctx.success({data: newData, msg: '登录成功'});
    }
}
