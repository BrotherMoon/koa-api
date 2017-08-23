const router = require('koa-router')()
const userCtrl = require('../controllers/user.controller')
const blogCtrl = require('../controllers/blog.controller')
const checkToken = require('../middlewares/checkToken')
/*用户相关路由*/
router.get('/user', userCtrl.findUsers)
    .get('/user/:name', userCtrl.findUser)
    .post('/user', userCtrl.createUser)
    .post('/user/login', userCtrl.login)
/*博客文章相关路由*/
router.post('/blog', blogCtrl.createBlog)
    .get('/blog', blogCtrl.findBlogs)
    .delete('/blog', blogCtrl.deleteBolg)
module.exports = router
