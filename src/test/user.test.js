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
  it('GET /user', (done) => {
    request()
    .get('/user')
    .set('authorization', token)
    .expect(200, done)
  })
  it('GET /user:name', (done) => {
    request()
    .get('/user/xuwenchao')
    .set('authorization', token)
    .expect(200)
    .end((err, res) => {
      if (err) return done(err)
      res.body.forEach(item => {
        item.should.have.property('name', 'xuwenchao')
      })
      done()
    })
  })
  it('POST /user', (done) => {
    request()
    .post('/user')
    .send({
      name: 'test',
      password: '123456'
    })
    .expect(201, done)
  })
  it('POST /user/login', (done) => {
    request()
    .post('/user/login')
    .send({
      name:'test',
      password: '123456'
    })
    .expect(200)
    .end((err, res) => {
      if (err) return done(err)
      res.body.should.have.property('user')
      res.body.should.have.property('token')
      done()
    })
  })
})
