const mongoose = require('./db')
const Schema = mongoose.Schema
const BlogSchema = new Schema({
    title: {type: String, required: true},
    authorId: {type: String, required: true},
    content: {type: String, required: true},
    tag: {type: String, default: '无标签'},
    private: {type: Boolean, default: false},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
}, {
    versionKey: false
})
module.exports = mongoose.model('blog', BlogSchema, 'blogs')
