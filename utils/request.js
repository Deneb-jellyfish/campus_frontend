// utils/request.js

// ⚠️ 请确认你的 IP 地址
// 如果是手机调试：http://192.168.x.x:8080/api
// 如果是浏览器调试：http://localhost:8080/api
const BASE_URL = 'http://localhost:8080/api' 

// 1. 获取 Token
export const getToken = () => {
  return uni.getStorageSync('token') || ''
}

// 2. 设置 Token (新增，防止以后报错)
export const setToken = (token) => {
  uni.setStorageSync('token', token)
}

// 3. 删除 Token (新增，解决当前的报错)
export const removeToken = () => {
  uni.removeStorageSync('token')
}

const request = (options) => {
  return new Promise((resolve, reject) => {
    const token = getToken()
    
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            if (res.data.code === 200) {
              resolve(res.data)
            } else {
              uni.showToast({ title: res.data.message || '请求失败', icon: 'none' })
              reject(res.data)
            }
        } else {
            uni.showToast({ title: `服务器错误 ${res.statusCode}`, icon: 'none' })
            reject(res)
        }
      },
      fail: (err) => {
        console.error('网络请求失败:', err)
        uni.showToast({ title: '服务器连接超时', icon: 'none' })
        reject(err)
      }
    })
  })
}

request.get = (url, data) => request({ url, method: 'GET', data })
request.post = (url, data) => request({ url, method: 'POST', data })
request.put = (url, data) => request({ url, method: 'PUT', data })
request.delete = (url, data) => request({ url, method: 'DELETE', data })

export default request