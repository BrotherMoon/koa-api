const supertest = require('supertest')
const jwt = require('jsonwebtoken')
const should = require('should')
const uuid = require('uuid/v1')
const app = require('../../app')
const config = require('../../config')
const userModel = require('../models/user.model')
const blogModel = require('../models/blog.model')
const request = () => supertest(app.listen())
let userForTest = {
  name: 'testUser',
  password: '123456'
}
describe('testing blog api', () => {
  // 先创建一个用户
  before((done) => {
    const testUser = new userModel(userForTest)
    testUser.save((err, result) => {
      Object.assign(userForTest, {_id: result._id})
      done()
    })
  })
  // 最后删除测试用户
  after((done) => {
    userModel.remove({name: userForTest.name}, (err, result) => done())
  })
  // 测试创建博客接口
  describe('POST /blogs', () => {
    it('should get 200 and blog data', (done) => {
      request()
      .post('/blogs')
      .send({
        title: 'test blog',
        author: userForTest._id,
        content: 'hahah'
      })
      .expect(201, done)
    })
    it('should get 400 and missing title waring', (done) => {
      request()
      .post('/blogs')
      .send({
        author: userForTest._id,
        content: 'hahah'
      })
      .expect(400)
      .end((err, res) => {
        res.body.should.have.property('msg', 'title is required')
        res.body.should.have.property('code', 1002)
        done()
      })
    })
    it('should get 400 and illegal title waring', (done) => {
      request()
      .post('/blogs')
      .send({
        title: 'uaS8DUJ09ASJDPAJSPODJKPOASKJDASJK;DJKASAsdNLKNMLKMLK',
        author: userForTest._id,
        content: 'hahah'
      })
      .expect(400)
      .end((err, res) => {
        res.body.should.have.property('msg', 'the length of title no more than 30 and it must be string')
        res.body.should.have.property('code', 1002)
        done()
      })
    })
    it('should get 400 and missing author waring', (done) => {
      request()
      .post('/blogs')
      .send({
        title: 'test blog',
        content: 'hahah'
      })
      .expect(400)
      .end((err, res) => {
        res.body.should.have.property('msg', 'author is required')
        res.body.should.have.property('code', 1002)
        done()
      })
    })
    it('should get 400 and illegal author waring', (done) => {
      request()
      .post('/blogs')
      .send({
        title: 'test blog',
        author: 1231423543534,
        content: 'hahah'
      })
      .expect(400)
      .end((err, res) => {
        res.body.should.have.property('msg', 'author must be a valid mongoId')
        res.body.should.have.property('code', 1002)
        done()
      })
    })
    it('should get 400 and missing content waring', (done) => {
      request()
      .post('/blogs')
      .send({
        title: 'test blog',
        author: userForTest._id
      })
      .expect(400)
      .end((err, res) => {
        res.body.should.have.property('msg', 'content is required')
        res.body.should.have.property('code', 1002)
        done()
      })
    })
    it('should get 400 and illegal content waring', (done) => {
      request()
      .post('/blogs')
      .send({
        title: 'test blog',
        author: userForTest._id,
        content: ' '
      })
      .expect(400)
      .end((err, res) => {
        res.body.should.have.property('msg', 'content must be a string and can`t not be empty')
        res.body.should.have.property('code', 1002)
        done()
      })
    })
  })
})
