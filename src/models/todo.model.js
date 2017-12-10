const mongoose = require('./db')
const Schema = mongoose.Schema
const TodoListSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  list: [
    {
      title: {
        type: String,
        required: true
      }
    }
  ]
}, {
  versionKey: false,
  timestamps: true
})
const todoListModel = mongoose.model('todoList', TodoListSchema, 'todoLists')
module.exports = {
  todoListModel
}