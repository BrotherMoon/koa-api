const qn = require('qn')
const config = require('../../config')
const client = qn.create({accessKey: config.qn.accessKey, secretKey: config.qn.secretKey, bucket: config.qn.bucket, uploadURL: 'http://up-z2.qiniu.com/'})
module.exports = {
  /**
   * 上传至七牛云
   * @param {} stream 文件流 
   */
  upload: (stream) => {
    return new Promise((resolve, reject) => {
      client.upload(stream, (err, result) => {
        !err ? resolve(`${config.qn.domainName}/${result.hash}`) : reject(err)
      })
    })
  }
}