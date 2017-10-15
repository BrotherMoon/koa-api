const _ = require('lodash')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const config = require('../../config')
const blogModel = require('../models/blog.model')
const ERROR_MESSAGE = require('../utils/const')
module.exports = {
    // 新建一篇博客
    createBlog: async ctx => {
        const {title, author, content, tag, public} = ctx.request.body
        // 参数校验
        let argError = ''
        if (!title) {
          argError = 'title is required'
        } else if (!_.isString(title) || title.trim().length > 30){
          argError = ERROR_MESSAGE.BLOG.ILLEGAL_TITLE
        } else if (!author) {
          argError = 'author is required'
        } else if (!_.isString(author) || !validator.isMongoId(author)) {
          argError = 'author must be a valid mongoId'
        } else if (!content) {
          argError = 'content is required'
        } else if (!_.isString(content) || !content.trim().length > 0) {
          argError = ERROR_MESSAGE.BLOG.ILLEGAL_CONTENT
        } else if (public && _.isNil([0, 1].find(num => num == public))) {
          argError = ERROR_MESSAGE.BLOG.ILLEGAL_PUBLIC
        } else if (tag) {
          if (!_.isString(tag) || !validator.isLength(tag.trim(), {min: 1, max: 10})) {
            argError = ERROR_MESSAGE.BLOG.ILLEGAL_TAG
          }
        }
        if (argError) return ctx.error({msg: argError, code: 1002})
        // 创建博客
        const newBlog = new blogModel({title, author, content, tag, public})
        const data = await newBlog.save()
        return data ? ctx.success({data, status: 201}) : ctx.error({msg: 'create failed', code: 1008})
    },
    // 查找博客
    findBlogs: async ctx => {
        const {keyword, author} = ctx.query
        const regex = new RegExp(keyword, 'i')
        let whereStr = {
          $or: [
            {title: {$regex: regex}},
            {content: {$regex: regex}}
          ]
        }
        // 如果author不为空,则在对应的author下查找
        author && Object.assign(whereStr, {author})
        // 如果需要查询设置为仅自己可见的博客则需要在请求头部传入又服务端颁发的token,然后解析token得出获得权限的_id是否与将要查询的_id是否一致,一致则可查看所有博客
        const token = ctx.request.header['authorization']
        // 解析出token中的用户_id
        const {_id} = token ? jwt.verify(token, config.tokenSecret) : false
        // 如果token中的_id与author不等则表明不是本人查看,则只能查询设置为公开的博客
        _id !== author && Object.assign(whereStr, {public: 1})
        const data = await blogModel.find(whereStr).populate({path: 'author', select: {id: 1, name: 1}})
        ctx.success({data})
    },
    // 更新博客内容
    updateBlog: async ctx => {
      const {blogId} = ctx.params
      const {title, content, tag, public} = ctx.request.body
      // 检测是否是合法的objectid
      if (!validator.isMongoId(blogId)) {
        return ctx.error({msg: 'invalid blogId', code: 1002, status: 400})
      }
      // 参数校验
      let argError = ''
      if (title) {
        if (!_.isString(title) || title.trim().length > 30){
          argError = ERROR_MESSAGE.BLOG.ILLEGAL_TITLE
        }
      } else if (content) {
        if (!_.isString(content) || !content.trim().length > 0) {
          argError = ERROR_MESSAGE.BLOG.ILLEGAL_CONTENT
        }
      } else if (public && _.isNil([0, 1].find(num => num == public))) {
        argError = ERROR_MESSAGE.BLOG.ILLEGAL_PUBLIC
      } else if (tag) {
        if (!_.isString(tag) || !validator.isLength(tag.trim(), {mix: 1, max: 15})) {
          argError = ERROR_MESSAGE.BLOG.ILLEGAL_TAG
        }
      }
      if (argError) return ctx.error({msg: argError, code: 1002})
      let updateStr = {title, content, public, tag}
      // 剔除没有传入的参数
      updateStr = _.omitBy(updateStr, _.isNil)
      // {new: true}表示更新成功后会返回更新后的信息，默认为false
      const data = await blogModel.findByIdAndUpdate(blogId, updateStr, {new: true})
      !_.isEmpty(data) ? ctx.success({status: 202, data}) : ctx.error({status: 400, code: 1007, msg: 'update failed'})
    },
    // 根据博客id删除博客
    deleteBolg: async ctx => {
        const {blogId} = ctx.params
        // 检测是否是合法的objectid
        if (!validator.isMongoId(blogId)) {
          return ctx.error({msg: 'invalid blogId', code: 1002, status: 400})
        }
        const data = await blogModel.findOneAndRemove({_id: blogId})
        !_.isEmpty(data) ? ctx.success({status: 204}) : ctx.error({msg: 'blog not found', code: 1006, status: 404})
    }
}
