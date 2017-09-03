const router = require('koa-router')()
const userCtrl = require('../controllers/user.controller')
const blogCtrl = require('../controllers/blog.controller')
const checkToken = require('../middlewares/checkToken')
/*用户相关路由*/
router.get('/users', userCtrl.findUsers)
      .get('/users/:name', userCtrl.findUser)
      .post('/users', userCtrl.createUser)
      .post('/users/login', userCtrl.login)
      .del('/users/:userId', checkToken, userCtrl.deleteUser)
/*博客文章相关路由*/
router.post('/blogs', blogCtrl.createBlog)
      .get('/blogs', blogCtrl.findBlogs)
      .del('/blogs/:blogId', blogCtrl.deleteBolg)
      .put('/blogs/:blogId', blogCtrl.updateBlog)
module.exports = router
