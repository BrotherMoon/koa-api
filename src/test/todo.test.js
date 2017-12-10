const supertest = require('supertest')
const jwt = require('jsonwebtoken')
const should = require('should')
const uuid = require('uuid/v1')
const app = require('../../app')
const config = require('../../config')
const userModel = require('../models/user.model')
const {todoListModel} = require('../models/todo.model')
const T_E = require('../utils/const').TODO_ERROR
const C_E = require('../utils/const').COMMON_ERROR
const request = () => supertest(app.listen())
let userForTest = {
  name: 'testUser',
  password: '123456',
  email: '111@qq.com'
}
let token = ''
describe('testing todo api', () => {
  // 查找用户,若不存在则创建用户
  before((done) => {
    userModel
      .findOne({name: 'testUser'})
      .then(result => {
        if (result) {
          return result
        } else {
          const testUser = new userModel(userForTest)
          return testUser.save()
        }
      })
      .then(result => {
        Object.assign(userForTest, {_id: result._id})
        // 创建模拟token
        token = jwt.sign({
          _id: result._id
        }, config.tokenSecret, {
          expiresIn: 60 * 5
        })
        console.log('Toekn by testUser for test ->', token)
        done()
      })
      .catch(err => console.error(err))
  })
  // 测试创建todo清单接口
  describe('POST /todo/list', () => {
    it('should get 201 and todo data', (done) => {
      request()
        .post('/todo/list')
        .set('authorization', token)
        .send({title: 'study'})
        .expect(201)
        .end((err, res) => {
          res.body.should.have.property('user')
          res.body.should.have.property('list')
          done()
        })
    })
  })
})