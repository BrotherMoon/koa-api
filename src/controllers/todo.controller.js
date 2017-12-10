const _ = require('lodash')
const validator = require('validator')
const {todoListModel} = require('../models/todo.model')
const T_E = require('../utils/const').TODO_ERROR
const C_E = require('../utils/const').COMMON_ERROR
module.exports = {
  // 插入清单
  createTodoList: async ctx => {
    const user = ctx._id
    const {title} = ctx.request.body
    // 参数校验
    let argError = ''
    if (!title) {
      argError = 'title is required'
    } else if (!_.isString(title) || !validator.isLength(title.trim(), {min: 1, max: 20})) {
      argError = T_E.ILLEGAL_LIST_TITLE[0]
    }
    if (argError) return ctx.error({msg: argError, code: C_E.ILLEGAL_PARAMETER[1]})
    // 插入清单list， upsert: true表示当插入的数组不存在时创建一个再进行插入
    const data = await todoListModel.findOneAndUpdate({user}, {
      $push: {list: {title}}
    }, {
      new: true,
      lean: true,
      upsert: true
    })
    !_.isEmpty(data) ? ctx.success({data, status: 201}) : ctx.error({msg: C_E.CREATE_FAILED[0], code: C_E.CREATE_FAILED[1]})
  }
}