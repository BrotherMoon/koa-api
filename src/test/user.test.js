const supertest = require('supertest')
const jwt = require('jsonwebtoken')
const should = require('should')
const uuid = require('uuid/v1')
const app = require('../../app')
const config = require('../../config')
const userModel = require('../models/user.model')
const request = () => supertest(app.listen())
// 创建模拟token
const token = jwt.sign({
  id: '89124819023j12jsadas'
}, config.tokenSecret, {expiresIn: 100})
let userForTest1 = {
  name: 'testUser1',
  password: '123456'
}
let userForTest2 = {
  name: 'testUser2',
  password: '123456'
}
describe('testing user api', () => {
  // 先创建一个测试用户
  before((done) => {
    const testUser = new userModel(userForTest1)
    testUser.save((err, result) => done())
  })
  // 最后删除这个测试用户
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
        res.body.should.have.property('password', userForTest2.password)
        Object.assign(userForTest2, {_id: res.body._id})
        done(err)
      })
    })
    it('should get 400 and user name already exists waring', (done) => {
      request()
      .post('/users')
      .send(userForTest1)
      .expect(400)
      .end((err, res) => {
        res.body.should.have.property('msg', 'user name already exists')
        res.body.should.have.property('code', 1005)
        done(err)
      })
    })
    it('should get 400 and missing name wraning', (done) => {
      request()
      .post('/users')
      .send({password: '123456'})
      .expect(400)
      .end((err, res) => {
        res.body.should.have.property('msg', 'missing name')
        res.body.should.have.property('code', 1002)
        done(err)
      })
    })
    it('should get 400 and missing password wraning', (done) => {
      request()
      .post('/users')
      .send({name: new Date().getTime().toString()})
      .expect(400)
      .end((err, res) => {
        res.body.should.have.property('msg', 'missing password')
        res.body.should.have.property('code', 1002)
        done(err)
      })
    })
    it('should get 400 and the illegal name warning', (done) => {
      request()
      .post('/users')
      .send({name: '12345678901234566', password: '123456'})
      .expect(400)
      .end((err, res) => {
        res.body.should.have.property('msg', 'the length of name must between 1 and 15')
        res.body.should.have.property('code', 1002)
        done(err)
      })
    })
    it('should get 400 and the illegal password warning', (done) => {
      request()
      .post('/users')
      .send({name: new Date().getTime().toString(), password: '1233'})
      .expect(400)
      .end((err, res) => {
        res.body.should.have.property('msg', 'the password need to have at least 6 characters')
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
  // 测试根据用户名获取用户信息接口
  describe('GET /users:name', () => {
    it(`should get 200 and an array is not empty`, (done) => {
      request()
      .get(`/users/${userForTest1.name}`)
      .expect(200)
      .end((err, res) => {
        res.body.forEach(item => {
          item.should.have.property('name', userForTest1.name)
        })
        done(err)
      })
    })
    it(`should get 400 and an empty array`, (done) => {
      request()
      .get(`/users/${uuid()}`)
      .expect(200)
      .end((err, res) => {
        res.body.should.be.empty()
        done(err)
      })
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
        res.body.should.have.property('user')
        res.body.should.have.property('token')
        done(err)
      })
    })
    it('should get 400 and wrong password warning', (done) => {
      request()
      .post('/users/login')
      .send({name: userForTest1.name, password: '1234567'})
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
        name: uuid(),
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
  // 测试更新用户信息借口接口
  describe('PUT /users', () => {
    it('should get 202 and the updated user info', (done) => {
      request()
      .put(`/users/${userForTest2._id}`)
      .expect(204, done)
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
    it(`should get 400 and user not found warning`, (done) => {
      request()
      .delete(`/users/111111111111111111111111`)
      .set('authorization', token)
      .expect(400)
      .end((err, res) => {
        res.body.should.have.property('msg', 'user not found')
        res.body.should.have.property('code', 1003)
        done(err)
      })
    })
  })
})
