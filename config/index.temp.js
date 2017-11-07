module.exports = {
  port: '3001', // 服务器运行端口
  tokenSecret: '123asdasd', // 生成jwt的secretkley
  expiresIn: 60 * 60 * 24 * 365, // jwt的过期时间
  mailer: {
    account: '110@qq.com', // 邮箱服务账号
    authorizationCode: 'ffutysby123213d' // 邮箱服务认证key
  },
  mongo: {
    uri: 'mongodb://root:123456@1.1.1.1:27017/api' // mongodb连接字符串
  },
  qn: {
    accessKey: 'RenWvhrL1FuI-asdasd123213asdasdr', // 七牛云accesskey
    secretKey: 'aVEY1aV_TPCCTjNasdZIt03v_123123123acac', // 七牛云secretkey
    domainName: 'http://123adsdsddas.bkt.clouddn.com', // 七牛云储存空间域名前缀
    bucket: 'name' // 七牛云储存空间名
  },
  requestUrl: ['http://1.1.1.1:3001'], //请求地址数组
}
