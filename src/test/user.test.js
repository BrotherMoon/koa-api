const supertest = require('supertest')
const jwt = require('jsonwebtoken')
const should = require('should')
const uuid = require('uuid/v1')
const app = require('../../app')
const config = require('../../config')
const userModel = require('../models/user.model')
const ERROR_MESSAGE = require('../utils/const')
const request = () => supertest(app.listen())
let token = '' 
let userForTest1 = {
  name: 'testUser1',
  password: '123456',
  email:'119@qq.com'
}
let userForTest2 = {
  name: 'testUser2',
  email:'810077182@qq.com'
}
describe('testing user api', () => {
  // 先创建一个测试用户
  before((done) => {
    // 先尝试删除含有测试用户名的用户账号，防止因测试中断数据残留造成测试失败
    userModel.remove({name: {$in: [userForTest1.name, userForTest2.name]}}, (err, result) => {
      const testUser = new userModel(userForTest1)
      testUser.save((err, result) => done())
    })
  })
  // 最后删除测试用户1
  after((done) => {
    userModel.remove({name: userForTest1.name}, (err, result) => done())
  })
  // 测试创建用户接口
  describe('POST /users', () => {
    it('should get 200 and user data', (done) => {
      request()
      .post('/users')
      .send(userForTest2)
      .expect(201)
      .end((err, res) => {
        res.body.should.have.property('name', userForTest2.name)
        Object.assign(userForTest2, {_id: res.body._id})
        token = jwt.sign({
          _id: res.body._id
        }, config.tokenSecret, {expiresIn: 100})
        done(err)
      })
    })
    it('should get 400 and account name already exists waring', (done) => {
      request()
      .post('/users')
      .send({
        name: userForTest1.name,
        email: '213@qq.com'
      })
      .expect(400)
      .end((err, res) => {
        res.body.should.have.property('msg', ERROR_MESSAGE.USER.USER_EXISTS)
        res.body.should.have.property('code', 1005)
        done(err)
      })
    })
    it('should get 400 and email has been used waring', (done) => {
      request()
      .post('/users')
      .send({
        name: new Date().getTime().toString(),
        email: userForTest1.email
      })
      .expect(400)
      .end((err, res) => {
        res.body.should.have.property('msg', ERROR_MESSAGE.USER.EMAIL_USED)
        res.body.should.have.property('code', 1009)
        done(err)
      })
    })
    it('should get 400 and missing name wraning', (done) => {
      request()
      .post('/users')
      .send({emaill: '123456@qq.com'})
      .expect(400)
      .end((err, res) => {
        res.body.should.have.property('msg', 'missing name')
        res.body.should.have.property('code', 1002)
        done(err)
      })
    })
    it('should get 400 and the illegal name warning', (done) => {
      request()
      .post('/users')
      .send({name: '12345678901234566', emaill: '123456@qq.com'})
      .expect(400)
      .end((err, res) => {
        res.body.should.have.property('msg', ERROR_MESSAGE.USER.ILLEGAL_NAME)
        res.body.should.have.property('code', 1002)
        done(err)
      })
    })
    it('should get 400 and missing email wraning', (done) => {
      request()
      .post('/users')
      .send({name: new Date().getTime().toString()})
      .expect(400)
      .end((err, res) => {
        res.body.should.have.property('msg', 'missing email')
        res.body.should.have.property('code', 1002)
        done(err)
      })
    })
    it('should get 400 and the illegal email warning', (done) => {
      request()
      .post('/users')
      .send({
        name: new Date().getTime().toString(),
        email: '123.cn'
      })
      .expect(400)
      .end((err, res) => {
        res.body.should.have.property('msg', ERROR_MESSAGE.USER.ILLEGAL_EMAIL)
        res.body.should.have.property('code', 1002)
        done(err)
      })
    })
  })
  // 测试获取所有用户数据接口
  describe('GET /users', () => {
    it('should get 200 and an array', (done) => {
      request()
      .get('/users')
      .expect(200, done)
    })
  })
  // 测试根据用户id获取用户信息接口
  describe('GET /users:id', () => {
    it(`should get 200 and userinfo`, (done) => {
      request()
      .get(`/users/${userForTest2._id}`)
      .expect(200)
      .end((err, res) => {
        res.body.should.have.property('name', userForTest2.name)
        done(err)
      })
    })
    it(`should get 204 no content`, (done) => {
      request()
      .get(`/users/111111111111111111111111`)
      .expect(204, done)
    })
    it(`should get 400 and invalid userId warning`, (done) => {
      request()
      .get(`/users/11111`)
      .expect(400, done)
    })
  })
  // 测试用户登录接口
  describe('POST /users/login', () => {
    it('should get 200 and an obj have user and token', (done) => {
      request()
      .post('/users/login')
      .send(userForTest1)
      .expect(200)
      .end((err, res) => {
        res.body.should.have.property('token')
        done(err)
      })
    })
    it('should get 400 and wrong password warning', (done) => {
      request()
      .post('/users/login')
      .send({email: userForTest1.email, password: '1234567'})
      .expect(400)
      .end((err, res) => {
        res.body.should.have.property('msg', 'wrong password')
        res.body.should.have.property('code', 1004)
        done(err)
      })
    })
    it('should get 400 and user not found warning', (done) => {
      request()
      .post('/users/login')
      .send({
        email: `${uuid()}@qq.com`,
        password: '123456'
      })
      .expect(400)
      .end((err, res) => {
        res.body.should.have.property('msg', 'user not found')
        res.body.should.have.property('code', 1003)
        done(err)
      })
    })
  })
  // 测试更新用户信息接口
  describe('PUT /users', () => {
    it('should get 400 and the invalid password warning', (done) => {
      request()
      .put(`/users/${userForTest2._id}`)
      .set('authorization', token)
      .send({password: 111111})
      .expect(400, done)
    })
    it('should get 202 and the updated user info', (done) => {
      request()
      .put(`/users/${userForTest2._id}`)
      .set('authorization', token)
      .send({password: '111111'})
      .expect(202, done)
    })
  })
  // 测试删除用户接口
  describe('DELETE /users:userId', () => {
    it(`should get 204`, (done) => {
      request()
      .delete(`/users/${userForTest2._id}`)
      .set('authorization', token)
      .expect(204, done)
    })
    it(`should get 400 and invalid userId warning`, (done) => {
      request()
      .delete(`/users/${uuid()}`)
      .set('authorization', token)
      .expect(400)
      .end((err, res) => {
        res.body.should.have.property('msg', 'invalid userId')
        res.body.should.have.property('code', 1002)
        done(err)
      })
    })
    it(`should get 404 and user not found warning`, (done) => {
      request()
      .delete(`/users/111111111111111111111111`)
      .set('authorization', token)
      .expect(404)
      .end((err, res) => {
        res.body.should.have.property('msg', 'user not found')
        res.body.should.have.property('code', 1006)
        done(err)
      })
    })
  })
})
