/*
 * @ use 统一响应请求中间件
 * @ error-msg  自定义的错误提示信息
 * @ error-status 错误返回码
 * @ success-data  请求成功时响应的数据
 * @ 调用ctx.error()   响应错误
 * @ 调用ctx.success()  响应成功
 */
module.exports = async(ctx, next) => {
    ctx.error = ({msg = 'error', code = 1002, status = 400}) => {
        ctx.status = status
        ctx.body = {msg, code}
    }
    ctx.success = ({data, status = 200}) => {
      ctx.status = status
      ctx.body = data
    }
    await next()
}
