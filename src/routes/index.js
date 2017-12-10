const router = require('koa-router')()
const userCtrl = require('../controllers/user.controller')
const blogCtrl = require('../controllers/blog.controller')
const serviceCtrl = require('../controllers/service.controller')
const checkToken = require('../middlewares/checkToken')
const todoCtrl = require('../controllers/todo.controller')
/*用户相关路由*/
router
      .get('/users', userCtrl.findUsers)
      .get('/users/:id', userCtrl.findUser)
      .post('/users', userCtrl.createUser)
      .post('/users/login', userCtrl.login)
      .put('/users/:userId', checkToken, userCtrl.updateUser)
      .del('/users/:userId', checkToken, userCtrl.deleteUser)
      .get('/users/:userId/tags', userCtrl.findTagsAndBogNum)
      .post('/avatar', checkToken, userCtrl.uploadAvatar)
      .get('/password/:email', userCtrl.sendMailWithPWd)
/*博客文章相关路由*/
router
      .post('/blogs', checkToken, blogCtrl.createBlog)
      .get('/blogs', blogCtrl.findBlogs)
      .get('/blogs/:id', blogCtrl.findBlog)
      .del('/blogs/:blogId', checkToken, blogCtrl.deleteBolg)
      .put('/blogs/:blogId', checkToken, blogCtrl.updateBlog)
/*微服务相关路由*/
router
      .get('/weather', serviceCtrl.getWeather)
// todo清单路由
router
      .post('/todo/list', checkToken, todoCtrl.createTodoList)
module.exports = router
