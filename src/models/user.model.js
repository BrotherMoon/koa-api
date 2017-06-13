const mongoose = require('./db');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {type: String, required: true}, // 用户名
    nickname: {type: String, required: true}, // 昵称
    /*    email: {type: String, default: ''},
     avatar: {type: String, default: ''},    // 头像
     profile: {type: String, default: ''},   // 个人简介
     password: {type: String, required: true},
     createdAt: {type: Date, default: Date.now},
     updatedAt: {type: Date, default: Date.now}*/
}, {
    versionKey: false
});

module.exports = mongoose.model('user', UserSchema, 'users');