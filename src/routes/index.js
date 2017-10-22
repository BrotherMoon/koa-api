const router = require('koa-router')()
const userCtrl = require('../controllers/user.controller')
const blogCtrl = require('../controllers/blog.controller')
const checkToken = require('../middlewares/checkToken')
/*用户相关路由*/
router.get('/users', userCtrl.findUsers)
      .get('/users/:id', userCtrl.findUser)
      .post('/users', userCtrl.createUser)
      .post('/users/login', userCtrl.login)
      .put('/users/:userId', userCtrl.updateUser)
      .del('/users/:userId', checkToken, userCtrl.deleteUser)
      .get('/users/:userId/tags', checkToken, userCtrl.findTagsAndBogNum)
/*博客文章相关路由*/
router.post('/blogs', checkToken, blogCtrl.createBlog)
      .get('/blogs', blogCtrl.findBlogs)
      .del('/blogs/:blogId', checkToken, blogCtrl.deleteBolg)
      .put('/blogs/:blogId', checkToken, blogCtrl.updateBlog)
module.exports = router
