const blogModel = require('../models/blog.model')
module.exports = {
    // 新建一篇博客
    createBlog: async ctx => {
        const {title, author, content, tag, private} = ctx.request.body
        if (!title) return ctx.error({msg: 'title is required'})
        if (!author) return ctx.error({msg: 'authorId is required'})
        if (!content) return ctx.error({msg: 'content is required'})
        const newBlog = new blogModel({title, author, content, tag, private})
        const data = await newBlog.save()
        ctx.success({data, status: 201})
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
