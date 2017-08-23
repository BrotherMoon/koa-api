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

// 报错
onerror(app)
// 格式化 response json
app.use(json())
// 解析http请求体
app.use(bodyParser())
// log
app.use(convert(logger()))
// cors允许跨域
app.use(cors())
// 自定义中间件
app.use(require('./src/middlewares/response'))
app.use(require('./src/middlewares/catch'))
// 定义静态文件根目录
app.use(koaStatic('doc'))
// 路由
app.use(router.routes())
    .use(router.allowedMethods())

app.listen(3001)
