const supertest = require('supertest')
const jwt = require('jsonwebtoken')
const should = require('should')
const uuid = require('uuid/v1')
const app = require('../../app')
const config = require('../../config')
const userModel = require('../models/user.model')
const blogModel = require('../models/blog.model')
const ERROR_MESSAGE = require('../utils/const')
const request = () => supertest(app.listen())
let userForTest = {
  name: 'testUser',
  password: '123456',
  email: '111@qq.com'
}
let blog = {}
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
      }, config.tokenSecret, {expiresIn: 60 * 5})
      console.log('Toekn by testUser for test ->', token)
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
        content: 'hahah'
      })
      .expect(201)
      .end((err, res) => {
        Object.assign(blog, res.body)
        done()
      })
    })
    it('should get 400 and missing title waring', (done) => {
      request()
      .post('/blogs')
      .set('authorization', token)
      .send({content: 'hahah'})
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
        content: 'hahah'
      })
      .expect(400)
      .end((err, res) => {
        res.body.should.have.property('msg', ERROR_MESSAGE.BLOG.ILLEGAL_TITLE)
        res.body.should.have.property('code', 1002)
        done()
      })
    })
    it('should get 400 and missing content waring', (done) => {
      request()
      .post('/blogs')
      .set('authorization', token)
      .send({title: 'test blog'})
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
        content: ' '
      })
      .expect(400)
      .end((err, res) => {
        res.body.should.have.property('msg', ERROR_MESSAGE.BLOG.ILLEGAL_CONTENT)
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
        content: 'xixix',
        public: 'haha'
      })
      .expect(400)
      .end((err, res) => {
        res.body.should.have.property('msg', ERROR_MESSAGE.BLOG.ILLEGAL_PUBLIC)
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
        content: 'xixix',
        tag: 'my note 123123123123123123123'
      })
      .expect(400)
      .end((err, res) => {
        res.body.should.have.property('msg', ERROR_MESSAGE.BLOG.ILLEGAL_TAG)
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
        content: 'xixix',
        tag: 123
      })
      .expect(400)
      .end((err, res) => {
        res.body.should.have.property('msg', ERROR_MESSAGE.BLOG.ILLEGAL_TAG)
        res.body.should.have.property('code', 1002)
        done()
      })
    })
  })
  // 测试根据博客id获取博客信息接口
  describe('GET /blogs:id', () => {
    it(`should get 200 and bloginfo`, (done) => {
      request()
      .get(`/blogs/${blog._id}`)
      .expect(200)
      .end((err, res) => {
        res.body.should.have.property('title', blog.title)
        done(err)
      })
    })
    it(`should get 204 no content`, (done) => {
      request()
      .get(`/blogs/111111111111111111111111`)
      .expect(204, done)
    })
    it(`should get 400 and invalid blogId warning`, (done) => {
      request()
      .get(`/blogs/11111`)
      .expect(400, done)
    })
  })
  // 测试根据关键字或者作者id查找博客接口
  describe('GET /blogs', () =>{
    it('should get 200 and an array', (done) => {
      request()
      .get('/blogs')
      .expect(200)
      .end((err, res) => {
        res.body.should.have.property('blogs')
        res.body.should.have.property('total')
        done()
      })
    })
  })
  // 测试更新博客接口
  describe('PUT /blog:blogId', () => {
    it('should get 202 and updated blog info', (done) => {
      request()
      .put(`/blogs/${blog._id}`)
      .set('authorization', token)
      .send({title: 'updated blog'})
      .expect(202, done)
    })
    it('should get 400 and illegal title waring', (done) => {
      request()
      .put(`/blogs/${blog._id}`)
      .set('authorization', token)
      .send({title: 'uaS8DUJ09ASJDPAJSPODJKPOASKJDASJK;DJKASAsdNLKNMLKMLK'})
      .expect(400)
      .end((err, res) => {
        res.body.should.have.property('msg', ERROR_MESSAGE.BLOG.ILLEGAL_TITLE)
        res.body.should.have.property('code', 1002)
        done()
      })
    })
    it('should get 400 and illegal content waring', (done) => {
      request()
      .put(`/blogs/${blog._id}`)
      .set('authorization', token)
      .send({content: ' '})
      .expect(400)
      .end((err, res) => {
        res.body.should.have.property('msg', ERROR_MESSAGE.BLOG.ILLEGAL_CONTENT)
        res.body.should.have.property('code', 1002)
        done()
      })
    })
    it('should get 400 and illegal public waring', (done) => {
      request()
      .put(`/blogs/${blog._id}`)
      .set('authorization', token)
      .send({public: 'haha'})
      .expect(400)
      .end((err, res) => {
        res.body.should.have.property('msg', ERROR_MESSAGE.BLOG.ILLEGAL_PUBLIC)
        res.body.should.have.property('code', 1002)
        done()
      })
    })
    it('should get 400 and illegal tag waring', (done) => {
      request()
      .put(`/blogs/${blog._id}`)
      .set('authorization', token)
      .send({tag: 'my note 123123123123123123123'})
      .expect(400)
      .end((err, res) => {
        res.body.should.have.property('msg', ERROR_MESSAGE.BLOG.ILLEGAL_TAG)
        res.body.should.have.property('code', 1002)
        done()
      })
    })
    it('should get 400 and illegal tag waring', (done) => {
      request()
      .put(`/blogs/${blog._id}`)
      .set('authorization', token)
      .send({tag: 123})
      .expect(400)
      .end((err, res) => {
        res.body.should.have.property('msg', ERROR_MESSAGE.BLOG.ILLEGAL_TAG)
        res.body.should.have.property('code', 1002)
        done()
      })
    })
  })
  // 测试删除博客接口
  describe('DELETE /blogs:userId', () => {
    it(`should get 204`, (done) => {
      request()
      .delete(`/blogs/${blog._id}`)
      .set('authorization', token)
      .expect(204, done)
    })
    it(`should get 400 and invalid blogId warning`, (done) => {
      request()
      .delete(`/blogs/${uuid()}`)
      .set('authorization', token)
      .expect(400)
      .end((err, res) => {
        res.body.should.have.property('msg', 'invalid blogId')
        res.body.should.have.property('code', 1002)
        done(err)
      })
    })
    it(`should get 404 and blog not found warning`, (done) => {
      request()
      .delete(`/blogs/111111111111111111111111`)
      .set('authorization', token)
      .expect(404)
      .end((err, res) => {
        res.body.should.have.property('msg', 'blog not found')
        res.body.should.have.property('code', 1006)
        done(err)
      })
    })
  })
})
