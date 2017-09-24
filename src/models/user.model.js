const mongoose = require('./db')
const Schema = mongoose.Schema
const UserSchema = new Schema({
    name: {type: String, required: true},
    avatar: {type: String, default: ''},
    profile: {type: String, default: '你还没有填写个人简介'},
    password: {type: String, required: true},
    active: {type: Number, default: 1}
}, {
    versionKey: false,
    timestamps: true
})
module.exports = mongoose.model('user', UserSchema, 'users')
