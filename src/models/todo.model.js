const mongoose = require('./db')
const Schema = mongoose.Schema
const TodoSchema = new Schema({
  listName: {type: String, required: true},
  user: {type: Schema.Types.ObjectId, ref: 'user', required: true},
  todos: [{
    title: {type: String, required: true},
    description: {type: String},
    star: {type: Number, default: 0},
    done: {type: Number, default: 0}
  }]
}, {
    versionKey: false,
    timestamps: true
})