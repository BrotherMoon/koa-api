/**
 * 校验token认证
 */
const jwt = require('jsonwebtoken')
const config = require('../../config')
module.exports = async(ctx, next) => {
  const token = ctx.request.header['authorization']
  if (token) {
    try {
      const decoded = jwt.verify(token, config.tokenSecret)
      ctx._id = decoded._id
      return next()
    } catch (err) {
      return ctx.error({msg: err.message, code: 1001, status: 401})
    }
  } else {
    return ctx.error({msg: 'unauthorized', code: 1000, status: 401})
  }
}
