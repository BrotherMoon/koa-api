const mongoose = require('./db')
const Schema = mongoose.Schema
const BlogSchema = new Schema({
    title: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, ref: 'user', require: true},
    content: {type: String, required: true},
    tag: {type: String, default: '无标签'},
    public: {type: Number, default: 1}
}, {
    versionKey: false,
    timestamps: true
})
module.exports = mongoose.model('blog', BlogSchema, 'blogs')
