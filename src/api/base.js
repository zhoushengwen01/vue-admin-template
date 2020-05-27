require('es6-promise').polyfill()
import axios from 'axios'
//import store from '@/store'
import { getToken } from '@/utils/auth'

const service = axios.create({
  baseURL: '/api', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})
// 每次请求携带cookies信息
service.defaults.withCredentials = true

// axios.defaults.timeout = 10000
service.defaults.headers.post['Content-Type'] = 'application/x-www=form-urlencoded'

// 请求之前拦截
// service.interceptors.request.use(
//   config => {
//     // do something before request is sent
//     if (store.getters.token) {
//       // let each request carry token
//       // ['X-Token'] is a custom headers key
//       // please modify it according to the actual situation
//       config.headers['X-Token'] = getToken()
//     }
//     return config
//   },
//   error => {
//     // do something with request error
//     console.log(error) // for debug
//     return Promise.reject(error)
//   }
// )

export default {

  service,

  // get请求
  requestGet(url, params = {}) {
    return new Promise((resolve, reject) => {
      service.get(url, params).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // get请求不带参数
  requestQuickGet(url) {
    return new Promise((resolve, reject) => {
      service.get(url).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // post请求
  requestPost(url, params = {}) {
    return new Promise((resolve, reject) => {
      service.post(url, params).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // post请求(表单)
  requestPostForm(url, params = {}) {
    return new Promise((resolve, reject) => {
      service.post(url, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(res => {
        resolve(res.data)// 注意res是axios封装的对象，res.data才是服务端返回的信息
      }).catch(error => {
        reject(error)
      })
    })
  },
  // put请求
  requestPut(url, params = {}) {
    return new Promise((resolve, reject) => {
      service.put(url, params).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // delete请求
  requestDelete(url, params = {}) {
    return new Promise((resolve, reject) => {
      service.delete(url, params).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}
