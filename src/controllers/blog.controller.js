const _ = require('lodash')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const config = require('../../config')
const blogModel = require('../models/blog.model')
const B_E = require('../utils/const').BLOG_ERROR
const C_E = require('../utils/const').COMMON_ERROR
module.exports = {
    // 新建一篇博客
    createBlog: async ctx => {
        const author = ctx._id
        const {title, content, tag, public} = ctx.request.body
        // 参数校验
        let argError = ''
        if (!title) {
          argError = 'title is required'
        } else if (!_.isString(title) || title.trim().length > 30){
          argError = B_E.ILLEGAL_TITLE[0]
        } else if (!content) {
          argError = 'content is required'
        } else if (!_.isString(content) || !content.trim().length > 0) {
          argError = B_E.ILLEGAL_CONTENT[0]
        } else if (public && _.isNil([0, 1].find(num => num == public))) {
          argError = B_E.ILLEGAL_PUBLIC[0]
        } else if (tag) {
          if (!_.isString(tag) || !validator.isLength(tag.trim(), {min: 1, max: 10})) {
            argError = B_E.ILLEGAL_TAG[0]
          }
        }
        if (argError) return ctx.error({msg: argError, code: C_E.ILLEGAL_PARAMETER[1]})
        // 创建博客
        const newBlog = new blogModel({title, author, content, tag, public})
        const data = await newBlog.save()
        return data ? ctx.success({data, status: 201}) : ctx.error({msg: C_E.CREATE_FAILED[0], code: C_E.CREATE_FAILED[1]})
    },
    // 根据博客id查找博客
    findBlog: async ctx => {
      const {id} = ctx.params
      // 检测是否是合法的objectid
      if (!validator.isMongoId(id)) {
        return ctx.error({msg: C_E.INVALID_MONGOID[0], code: C_E.INVALID_MONGOID[1]})
      }
      const data = await blogModel.findOne({_id: id}).populate({path: 'author', select: {password: 0}})
      ctx.success({data})
    },
    // 根据关键字或作者的id查找博客
    findBlogs: async ctx => {
        const {keyword, author} = ctx.query
        let {skip, limit, tag} = ctx.query
        skip = parseInt(skip) || 0
        limit= parseInt(limit) || 10
        const regex = new RegExp(keyword, 'i')
        let whereStr = {
          $or: [
            {title: {$regex: regex}},
            {content: {$regex: regex}}
          ]
        }
        author && Object.assign(whereStr, {author})
        tag && Object.assign(whereStr, {tag})
        // 查询博客总数
        const total = await blogModel.count(whereStr)
        // 按条件查找博客
        const data = await blogModel
          .find(whereStr)
          .limit(limit)
          .skip(skip)
          .populate({path: 'author', select: {password: 0}})
          .sort({createdAt: -1})
        ctx.success({data: {
          skip,
          limit,
          total,
          blogs: data
        }})
    },
    // 更新博客内容
    updateBlog: async ctx => {
      const userId = ctx._id
      const {blogId} = ctx.params
      const {title, content, tag, public} = ctx.request.body
      // 检测是否是合法的objectid
      if (!validator.isMongoId(blogId)) {
        return ctx.error({msg: C_E.INVALID_MONGOID[0], code: C_E.INVALID_MONGOID[1]})
      }
      // 参数校验
      let argError = ''
      if (title) {
        if (!_.isString(title) || title.trim().length > 30){
          argError = B_E.ILLEGAL_TITLE[0]
        }
      } else if (content) {
        if (!_.isString(content) || !content.trim().length > 0) {
          argError = B_E.ILLEGAL_CONTENT[0]
        }
      } else if (public && _.isNil([0, 1].find(num => num == public))) {
        argError = B_E.ILLEGAL_PUBLIC[0]
      } else if (tag) {
        if (!_.isString(tag) || !validator.isLength(tag.trim(), {mix: 1, max: 15})) {
          argError = B_E.ILLEGAL_TAG[0]
        }
      }
      if (argError) return ctx.error({msg: argError, code: C_E.ILLEGAL_PARAMETER[1]})
      let updateStr = {title, content, public, tag}
      // 剔除没有传入的参数
      updateStr = _.omitBy(updateStr, _.isNil)
      // {new: true}表示更新成功后会返回更新后的信息，默认为false
      const data = await blogModel.findOneAndUpdate({_id: blogId, author: userId}, updateStr, {new: true})
      !_.isEmpty(data) ? ctx.success({status: 202, data}) : ctx.error({code: C_E.UPDATE_FAILED[1], msg: C_E.UPDATE_FAILED[0]})
    },
    // 根据博客id删除博客
    deleteBolg: async ctx => {
        const userId = ctx._id      
        const {blogId} = ctx.params
        // 检测是否是合法的objectid
        if (!validator.isMongoId(blogId)) {
          return ctx.error({msg: C_E.INVALID_MONGOID[0], code: C_E.INVALID_MONGOID[1]})
        }
        const data = await blogModel.findOneAndRemove({_id: blogId, author: userId})
        !_.isEmpty(data) ? ctx.success({status: 204}) : ctx.error({msg: C_E.NOT_FOUND[0], code: C_E.NOT_FOUND[1], status: 404})
    }
}
