const supertest = require('supertest')
const should = require('should')
const app = require('../../app')
const request = () => supertest(app.listen())
describe('test service api', () => {
  // 测试获取天气信息接口
  describe('test weather api', () => {
    it('should get 404 and area not found info', (done) => {
      request()
        .get(`/weather?cityName=什么鬼`)
        .expect(404, done)
    })
    it('should get 200', (done) => {
      request()
        .get(`/weather`)
        .expect(200, done)
    })
  })
})