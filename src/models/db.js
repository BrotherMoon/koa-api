const mongoose = require('mongoose')
const config = require('../../config')
// 创建连接
mongoose.connect(config.mongo.uri)
// 连接成功回调
mongoose
    .connection
    .on('connected', () => {
        console.log('Mongoose connection connected')
    })
// 连接失败回调
mongoose
    .connection
    .on('error', (err) => {
        console.log(`Mongoose connection error: ${err}`)
    })
// 断开连接回调
mongoose
    .connection
    .on('disconnected', () => {
        console.log('Mongoose connection disconnected')
    })
module.exports = mongoose
