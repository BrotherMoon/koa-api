const _ = require('lodash')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const config = require('../../config')
const blogModel = require('../models/blog.model')
module.exports = {
    // 新建一篇博客
    createBlog: async ctx => {
        const {title, author, content, tag, public} = ctx.request.body
        // 参数校验
        let argError = ''
        if (!title) {
          argError = 'title is required'
        } else if (!_.isString(title) || title.trim().length > 30){
          argError = 'the length of title no more than 30 and it must be string'
        } else if (!author) {
          argError = 'author is required'
        } else if (!_.isString(author) || !validator.isMongoId(author)) {
          argError = 'author must be a valid mongoId'
        } else if (!content) {
          argError = 'content is required'
        } else if (!_.isString(content) || !content.trim().length > 0) {
          argError = 'content must be a string and can`t not be empty'
        } else if (public && _.isNil([0, 1].find(num => num == public))) {
          argError = 'public need to be one of 0 and 1'
        } else if (tag) {
          if (!_.isString(tag) || !validator.isLength(tag.trim(), {mix: 1, max: 15})) {
            argError = 'tag must be a string and the length of tag must between 1 and 15'
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
      const {blogId} = ctx.request.body
      const {title, content, tag, public} = ctx.request.body
      console.log()
      console.log(blogId)
      // const data = await blogModel.update({_id: blogId}, )
    },
    // 根据博客id删除博客
    deleteBolg: async ctx => {
        const {blogId} = ctx.params
        const data = await blogModel.remove({_id: id})
        data.result.n > 0 ? ctx.success({data: 'successfully delete'}) : ctx.error({msg: 'delete failed', code: 1001})
    }
}
