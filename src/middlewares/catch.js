/*
 * @ use 统一try catch处理中间件
 * @ 用于捕获内部错误，输出日志信息
 */

module.exports = async(ctx, next) => {
    try {
        await next();
    } catch (err) {
        if (!err) {
            ctx.error({msg: new Error('未知错误!')});
        }
        if (typeof(err) == 'string') {
            ctx.error({msg: new Error(err)});
        }
        ctx.error({msg: '服务器错误!', error: err, status: 500});
    }
}
