/*
 * @Author       : linxiao
 * @Date         : 2023-03-27 09:53:48
 * @LastEditors  : linxiao
 * @LastEditTime : 2023-03-28 15:33:52
 * @FilePath     : /src/utils/http.js
 * @Description  :
 * Copyright 2023 OBKoro1, All Rights Reserved.
 * 2023-03-27 09:53:48
 */
/*
 * @Author: linxiao
 * @Date: 2022-07-17 00:21:02
 * @LastEditors: linxiao xiao.lin@transsion.com
 * @LastEditTime: 2023-03-23 18:29:19
 * @FilePath: /vue3-ts-vite/src/utils/http/index.ts
 */
import axios from 'axios'

const messageDate = new Date().getTime()
const service = axios.create({
  baseURL: '/api',
  // baseURL: import.meta.env.VITE_API_BASE_URL,
  // timeout: 30 * 1000,
  // 请求是否携带cookie
  withCredentials: true,
  headers: {
    'X-RPCX-MessagelD': messageDate.toString().substring(0, 10),
    'X-RPCX-MesssageType': 0,
    'X-RPCX-SerializeType': 1
  }
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 可以处理token等
    // console.log('config', config)
    return config
  },
  err => {
    AMessage.error(err)
    return Promise.reject(err)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // console.log('xxxx', response)
    // const { status } = response
    // if (status < 200 || status >= 300) {
    //   // 统一处理http错误，或者处理后抛到业务代码 TODO
    // }
    return response
  },
  err => {
    const { status, detail } = err.response.data
    // 根据返回的http状态码做不同的处理，比如错误提示等 TODO
    switch (status) {
      case 401:
        // 鉴权失败
        AMessage.error(detail)
        break
      case 403:
        // 没有权限
        AMessage.error(detail)
        break
      case 500:
        AMessage.error(detail)
        // 服务端错误
        break
      default:
        AMessage.error('API error: ' + detail)
        break
    }

    return Promise.reject(err)
  }
)

// 封装一层以更好的统一定义接口返回的类型
const request = config => {
  return new Promise((resolve, reject) => {
    service
      .request(config)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export default request
