const config = require('../config')
const qiniu = require('qiniu')
const mac = new qiniu.auth.digest.Mac(config.qn.accessKey, config.qn.secretKey)
const options = {
  scope: config.qn.bucketName
}
const putPolicy = new qiniu.rs.PutPolicy(options)
const uploadToken = putPolicy.uploadToken(mac)
const config = new qiniu.conf.Config()
const localFile = "../imgs/f2adedca27280d4e3980401d4db7e8e0.jpeg"
const formUploader = new qiniu.form_up.FormUploader(config)
const putExtra = new qiniu.form_up.PutExtra()
formUploader.putFile(uploadToken, null, localFile, putExtra, function(respErr, respBody, respInfo) {
  if (respErr) {
    throw respErr
  }
  if (respInfo.statusCode == 200) {
    console.log(respBody)
  } else {
    console.log(respInfo.statusCode)
    console.log(respBody)
  }
})
