const router = require('koa-router')();
const userCtrl = require('../controllers/user.controller');

router.get('/user', userCtrl.insert)

module.exports = router;