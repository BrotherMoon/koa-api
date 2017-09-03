const supertest = require('supertest')
const jwt = require('jsonwebtoken')
const should = require('should')
const app = require('../../app')
const config = require('../../config')
const request = () => supertest(app.listen())
const token = jwt.sign({
  id: '89124819023j12jsadas'
}, config.tokenSecret, {expiresIn: 100})
describe('testing user api', () => {
  let user = {
    name: new Date().getTime().toString(),
    password: '123456'
  }
  it('POST /users', (done) => {
    request()
    .post('/users')
    .send(user)
    .expect(201)
    .end((err, res) => {
      res.body.should.have.property('name', user.name)
      res.body.should.have.property('password', user.password)
      console.log(res.body)
      Object.assign(user, {_id: res.body._id})
      console.log(user)
      done(err)
    })
  })
  it('GET /users', (done) => {
    request()
    .get('/users')
    .set('authorization', token)
    .expect(200, done)
  })
  it(`GET /users:name`, (done) => {
    request()
    .get(`/users/${user.name}`)
    .set('authorization', token)
    .expect(200)
    .end((err, res) => {
      res.body.forEach(item => {
        item.should.have.property('name', user.name)
      })
      done(err)
    })
  })
  it('POST /users/login', (done) => {
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
  it(`DELETE /user:userId`, (done) => {
    request()
    .delete(`/users/${user._id}`)
    .expect(204, done)
  })
})
