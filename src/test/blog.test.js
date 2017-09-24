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
let token = ''
describe('testing blog api', () => {
  // 查找用户,若不存在则创建用户
  before((done) => {
    userModel.findOne({name: 'testUser'}).then(result => {
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
      }, config.tokenSecret, {expiresIn: 10000})
      console.log('toekn ->', token)
      done()
    })
    .catch(err => console.error(err))
  })
  // 测试创建博客接口
  describe('POST /blogs', () => {
    it('should get 201 and blog data', (done) => {
      request()
      .post('/blogs')
      .set('authorization', token)
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
      .set('authorization', token)
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
      .set('authorization', token)
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
      .set('authorization', token)
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
      .set('authorization', token)
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
      .set('authorization', token)
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
      .set('authorization', token)
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
    it('should get 400 and illegal public waring', (done) => {
      request()
      .post('/blogs')
      .set('authorization', token)
      .send({
        title: 'test blog',
        author: userForTest._id,
        content: 'xixix',
        public: 'haha'
      })
      .expect(400)
      .end((err, res) => {
        res.body.should.have.property('msg', 'public need to be one of 0 and 1')
        res.body.should.have.property('code', 1002)
        done()
      })
    })
    it('should get 400 and illegal tag waring', (done) => {
      request()
      .post('/blogs')
      .set('authorization', token)
      .send({
        title: 'test blog',
        author: userForTest._id,
        content: 'xixix',
        tag: 'my note 123123123123123123123'
      })
      .expect(400)
      .end((err, res) => {
        res.body.should.have.property('msg', 'tag must be a string and the length of tag must between 1 and 15')
        res.body.should.have.property('code', 1002)
        done()
      })
    })
    it('should get 400 and illegal tag waring', (done) => {
      request()
      .post('/blogs')
      .set('authorization', token)
      .send({
        title: 'test blog',
        author: userForTest._id,
        content: 'xixix',
        tag: 123
      })
      .expect(400)
      .end((err, res) => {
        res.body.should.have.property('msg', 'tag must be a string and the length of tag must between 1 and 15')
        res.body.should.have.property('code', 1002)
        done()
      })
    })
  })
  // 测试查找博客接口
  describe('GET /blogs', () =>{
    it('should get 200 and an array', (done) => {
      request()
      .get('/blogs')
      .expect(200)
      .end((err, res) => {
        res.body.should.have.property('length')
        done()
      })
    })
  })
})
