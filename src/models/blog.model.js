const mongoose = require('./db');
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
    title: {type: String, required: true},
    authorId: {type: String, required: true},
    content: {type: String, required: true},
    category: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
}, {
    versionKey: false
});

module.exports = mongoose.model('blog', BlogSchema, 'blogs');