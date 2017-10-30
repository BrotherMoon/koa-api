const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const bodyParser = require('koa-bodyparser')
const convert = require('koa-convert')
const logger = require('koa-logger')
const onerror = require('koa-onerror')
const config = require('./config')
const router = require('./src/routes')
const cors = require('koa-cors')
const koaStatic = require('koa-static')
const compress = require('koa-compress')
// 报错
onerror(app)
// gzip压缩
app.use(compress())
// 格式化 response json
app.use(json())
// 解析http请求体
app.use(bodyParser())
// log
app.use(convert(logger()))
// cors允许跨域
app.use(cors())
// 使用自定义中间件
app.use(require('./src/middlewares/response'))
app.use(require('./src/middlewares/catch'))
// 定义静态文件根目录
app.use(koaStatic('doc'))
// 路由
app.use(router.routes())
  .use(router.allowedMethods())
if (module.parent) {
  module.exports = app
} else {
  app.listen(config.port, () => console.log(`^_^: koa-api listening on port -> ${config.port}`))
}