import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'

// create an axios instance
const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout,
  // 返回数据的格式，可选值为arraybuffer,blob,document,json,text,stream，默认值为json
  responseType: 'blob'
})

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

// request interceptor
instance.interceptors.request.use(
  config => {
    // do something before request is sent
    console.log('request config', config)

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    // do something with request error
    // for debug
    console.log('request error', error)
    return Promise.reject(error)
  }
)

// response interceptor
instance.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    console.log('response res', res)

    return response
  },
  error => {
    console.log('response error', error)
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default instance
