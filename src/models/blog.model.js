const mongoose = require('./db')
const Schema = mongoose.Schema
const BlogSchema = new Schema({
    title: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, ref: 'user'},
    content: {type: String, required: true},
    tag: {type: String, default: '无标签'},
    private: {type: Boolean, default: false}
}, {
    versionKey: false,
    timestamps: true
})
module.exports = mongoose.model('blog', BlogSchema, 'blogs')
