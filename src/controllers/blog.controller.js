const blogModel = require('../models/blog.model');
module.exports = {
    createBlog: async ctx => {
        const {title, authorId, content, category} = ctx.request.body;
        if (!title) return ctx.error({msg: '标题不能为空'});
        if (!authorId) return ctx.error({msg: '作者id不能为空'});
        if (!content) return ctx.error({msg: '内容不能为空'});
        if (!category) return ctx.error({msg: '分类不能为空'});
        const newBlog = new blogModel({title, authorId, content, category});
        const data = await newBlog.save();
        ctx.success({data, msg: '添加文章成功'})
    }
}
