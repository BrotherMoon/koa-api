/*
 * @ use 统一try catch处理中间件
 * @ 用于捕获内部错误，输出日志信息
 */
module.exports = async(ctx, next) => {
    try {
        await next()
    } catch (err) {
        if (!err) {
            ctx.error({msg: new Error('unknow error!'), status: 500})
        }
        if (typeof(err) == 'string') {
            ctx.error({msg: new Error(err), status: 500})
        }
        ctx.error({msg: 'internal server error!', status: 500})
        console.error(err)
    }
}
