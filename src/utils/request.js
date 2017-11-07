const axios = require('axios')
const {parseJSON, obj2FormData} =  require('../utils/helper')
const config = require('../../config')
const baseURL = config.requestUrl
// 设置默认请求超时时间为10s
axios.defaults.timeout = 10000
axios.interceptors.response.use(response => response, (error) => {
  return Promise.reject(error)
})
module.exports = {
  /**
   * [post 发送post请求
   * @param  {[type]} url              [请求的地址，不包含前缀]
   * @param  {[type]} data             [发送的数据]
   * @param  {Number} [baseURLIndex=0] [请求地址前缀index，默认是0]
   * @param  {[type]} successCb        [成功的回调函数]
   * @param  {[type]} errorCb          [失败回调函数]
   */
  post(url, data, {
    baseURLIndex = 0,
    successCb,
    errorCb
  } = {}) {
    formData && (data = obj2FormData(data))
    let options = {
      method: 'post',
      url,
      data,
      baseURL: baseURL[baseURLIndex]
    }
    return axios(options).then((res) => {
      successCb && successCb(res)
      return res
    }).catch((err) => {
      console.error('a error after post ->', err)
      errorCb && errorCb(err)
      return Promise.reject(err)
    })
  },
  /**
   * [get 发送get请求
   * @param  {[type]} url              [请求的地址，不包含前缀]
   * @param  {[type]} data             [发送的数据]
   * @param  {Number} [baseURLIndex=0] [请求地址前缀index，默认是0]
   * @param  {[type]} successCb        [成功的回调函数]
   * @param  {[type]} errorCb          [失败回调函数]
   */
  get(url, data, {
    baseURLIndex = 0,
    successCb,
    errorCb
  } = {}) {
    let options = {
      method: 'get',
      url,
      params: data,
      baseURL: baseURL[baseURLIndex]
    }
    return axios(options).then((res) => {
      successCb && successCb(res)
      return res
    }).catch((err) => {
      console.error('a error after get ->', err)
      errorCb && errorCb(err)
      return Promise.reject(err)
    })
  },
  /**
   * [delete] 发送delete请求
   */
  delete(url, data, {
    baseURLIndex = 0,
    successCb,
    errorCb
  } = {}) {
    let options = {
      method: 'delete',
      url,
      data,
      baseURL: baseURL[baseURLIndex]
    }
    return axios(options).then((res) => {
      successCb && successCb(res)
      return res
    }).catch((err) => {
      console.error('a error after delete ->', err)
      errorCb && errorCb(err)
      return Promise.reject(err)
    })
  },
  /**
   * [put] 发送put请求
   */
  put(url, data, {
    baseURLIndex = 0,
    successCb,
    errorCb,
  } = {}) {
    let options = {
      method: 'put',
      url,
      data,
      baseURL: baseURL[baseURLIndex]
    }
    return axios(options).then((res) => {
      successCb && successCb(res)
      return res
    }).catch((err) => {
      console.error('a error after put ->', err)
      errorCb && errorCb(err)
      return Promise.reject(err)
    })
  }
}
