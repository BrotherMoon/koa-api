const supertest = require('supertest')
const jwt = require('jsonwebtoken')
const should = require('should')
const uuid = require('uuid/v1')
const app = require('../../app')
const config = require('../../config')
const request = () => supertest(app.listen())
const token = jwt.sign({
  id: '89124819023j12jsadas'
}, config.tokenSecret, {expiresIn: 100})
let user = {
  name: new Date().getTime().toString(),
  password: '123456'
}
describe('testing user api', () => {
  describe('POST /users', () => {
    it('should get 200 and user data', (done) => {
      request()
      .post('/users')
      .send(user)
      .expect(201)
      .end((err, res) => {
        res.body.should.have.property('name', user.name)
        res.body.should.have.property('password', user.password)
        Object.assign(user, {_id: res.body._id})
        done(err)
      })
    })
    it('should get 400 and user name already exists waring', (done) => {
      request()
      .post('/users')
      .send(user)
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
        res.body.should.have.property('msg')
        res.body.should.have.property('code', 1002)
        done(err)
      })
    })
  })
  describe('GET /users', () => {
    it('should get 200 and an array', (done) => {
      request()
      .get('/users')
      .expect(200, done)
    })
  })
  describe('GET /users:name', () => {
    it(`should get 200 and an array is not empty`, (done) => {
      request()
      .get(`/users/${user.name}`)
      .expect(200)
      .end((err, res) => {
        res.body.forEach(item => {
          item.should.have.property('name', user.name)
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
  describe('POST /users/login', () => {
    it('should get 200 and an obj have user and token', (done) => {
      request()
      .post('/users/login')
      .send(user)
      .expect(200)
      .end((err, res) => {
        res.body.should.have.property('user')
        res.body.should.have.property('token')
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
  describe('DELETE /users:userId', () => {
    it(`should get 204`, (done) => {
      request()
      .delete(`/users/${user._id}`)
      .set('authorization', token)
      .expect(204, done)
    })
  })
})
