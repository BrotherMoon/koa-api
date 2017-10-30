const qn = require('qn')
const config = require('../../config')
const client = qn.create({accessKey: config.qn.accessKey, secretKey: config.qn.secretKey, bucket: config.qn.bucket, uploadURL: 'http://up-z2.qiniu.com/'})
module.exports = {
  upload: (stream) => {
    return new Promise((resolve, reject) => {
      client.upload(stream, (err, result) => {
        if (!err) {
          resolve(`${config.qn.domainName}/${result.hash}`)
        } else {
          reject(err)
        }
      })
    })
  }
}