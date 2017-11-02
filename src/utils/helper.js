const config = require('../../config')
const nodemailer = require('nodemailer')
// nodemailer配置文件
const transporter = nodemailer.createTransport({
  service: 'qq',
  auth: {
    user: config.mailer.account,
    pass: config.mailer.authorizationCode
  }
})
/**
 * [sendMail 发送邮件]
 * @param  {[type]} to [目标邮箱]
 * @param  {[type]} p1 [段落一内容]
 * @param  {[type]} p2 [段落二内容]
 * @return {[promise]}
 */
const sendMail = ({to, p1, p2}) => {
  let mailOptions = {
    subject: '这是一封来自r-blog的邮件',
    from: config.mailer.account,
    to,
    html: `<h3 style='text-align: center; margin: .5rem 0; color: gray'>欢迎使用r-blog</h3><p style='margin: .3rem 0'>${p1}</p><p>${p2}</p>` // html body
  }
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return reject(error)
      }
      return resolve(info.messageId)
    })
  })
}
/**
 * [obj2FormData 把传入的对象转换成formdata]
 */
const obj2FormData = (obj) => {
  let formdata = new FormData()
  Object.keys(obj).forEach(i => formdata.append(i, obj[i]))
  return formdata
}
// 解析json字符串
const parseJSON = (str) => {
  try {
    return JSON.parse(str)
  } catch (e) {
    console.log(`^.^  parse json error: ${e}`)
    return {}
  }
}
module.exports = {sendMail, obj2FormData, parseJSON}
