const blogModel = require('../models/blog.model')
const _ = require('lodash')
const validator = require('validator')
module.exports = {
    // 新建一篇博客
    createBlog: async ctx => {
        const {title, author, content, tag, private} = ctx.request.body
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
        }
        if (argError) return ctx.error({msg: argError, code: 1002})
        // 创建博客
        const newBlog = new blogModel({title, author, content, tag, private})
        const data = await newBlog.save()
        return data ? ctx.success({data, status: 201}) : ctx.error({msg: 'create failed', code: 1008})
    },
    // 根据标题还有内容进行查找博客
    findBlogs: async ctx => {
        const {keyword, authorId} = ctx.query
        const regex = new RegExp(keyword, 'i')
        let whereStr = {
          $or: [
            {title: {$regex: regex}},
            {content: {$regex: regex}}
          ]
        }
        authorId && Object.assign(whereStr, {author})
        const data = await blogModel.find(whereStr).populate({path: 'author', select: {id: 1, name: 1}})
        ctx.success({data})
    },
    // 更新博客内容
    updateBlog: async ctx => {
      const {blogId} = ctx.request.body
      const {title, content, tag, private} = ctx.request.body
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
