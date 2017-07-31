const blogModel = require('../models/blog.model')
module.exports = {
    createBlog: async ctx => {
        const {title, authorId, content, tag, private} = ctx.request.body
        if (!title) return ctx.error({msg: 'title is required'})
        if (!authorId) return ctx.error({msg: 'authorId is required'})
        if (!content) return ctx.error({msg: 'content is required'})
        const newBlog = new blogModel({title, authorId, content, tag, private})
        const data = await newBlog.save()
        ctx.success({data})
    },
    findBlogs: async ctx => {
        const {keyword} = ctx.query
        console.log(keyword)
        const regex = new RegExp(keyword, 'i')
        const data = await blogModel.find({
          $or: [
            {title: {$regex: regex}},
            {content: {$regex: regex}}
          ]
        })
        ctx.success({data})
    },
    deleteBolg: async ctx => {
        const {id} = ctx.request.body
        const data = await blogModel.remove({id})
        data.result.n > 0 ? ctx.success() : ctx.error()
    }
}
