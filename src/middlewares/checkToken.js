/**
 * 校验token认证
 */
const jwt = require('jsonwebtoken')
const config = require('../../config')
module.exports = async(ctx, next) => {
  const token = ctx.request.header['authorization']
  if (token) {
    const decoded = jwt.decode(token, config.tokenSecret)
    if (decoded.exp <= new Date() / 1000) {
      ctx.error({msg: 'token have expired', code: 1000, status: 401})
    } else {
      return next()
    }
  } else {
    ctx.error({msg: 'unauthorized', code: 1000, status: 401})
  }
}
