const blogModel = require('../models/blog.model');
module.exports = {
    createBlog: async ctx => {
        const {title, authorId, content, tag, private} = ctx.request.body;
        if (!title) return ctx.error({msg: '标题不能为空'});
        if (!authorId) return ctx.error({msg: '作者id不能为空'});
        if (!content) return ctx.error({msg: '内容不能为空'});
        const newBlog = new blogModel({title: 'asd', authorId, content, tag, private});
        const data = await newBlog.save();
        ctx.success({data, msg: '添加文章成功'});
    },
    findBlogs: async ctx => {
        const data = await blogModel.find();
        ctx.success({data, msg: '获取所有文章成功'});
    },
    deleteBolg: async ctx => {
        const {id} = ctx.request.body;
        const data = await blogModel.remove({'id': id});
        data.result.n > 0 ? ctx.success({msg: '删除文章成功'}) : ctx.error({msg: '删除文章失败'});
    }
}
