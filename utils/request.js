// utils/request.js - 支持 Mock 的网络请求封装

// ==================== 配置区 ====================

// 是否使用 Mock 数据（开发时设为 true，打包前改为 false）
let USE_MOCK = false

// 真实后端地址
const BASE_URL = 'http://localhost:8080/api'

// Mock 地址（本地）
const MOCK_URL = '/api' // Mock 地址通常与 BASE_URL 保持一致，或仅为路径

// 请求超时时间
const TIMEOUT = 10000

// Token 存储键名
const TOKEN_KEY = 'token'

// ==================== Mock 数据导入 ====================

// 如果启用 Mock，导入 Mock 数据
if (USE_MOCK) {
  // #ifdef H5
  // H5 环境下直接导入
  import('@/mock/index.js')
  // #endif
  
  // #ifdef MP || APP-PLUS
  // 小程序和 APP 环境下使用 Better-Mock
  const Mock = require('better-mock/dist/mock.mp.js')
  require('@/mock/index.js')
  // #endif
}

/**
 * 获取请求基础地址
 */
const getBaseUrl = () => {
  return USE_MOCK ? MOCK_URL : BASE_URL
}

/**
 * 请求拦截器 - Token 自动注入
 */
const requestInterceptor = (config) => {
  const token = uni.getStorageSync(TOKEN_KEY)
  
  if (token) {
    config.header = {
      ...config.header,
      'Authorization': `Bearer ${token}`
    }
  }
  
  // 添加时间戳防止缓存
  if (config.method === 'GET') {
    config.data = {
      ...config.data,
      _t: Date.now()
    }
  }
  
  // 开发环境打印请求信息
  if (process.env.NODE_ENV === 'development') {
    console.log('【请求】', config.method, config.url, config.data)
  }
  
  return config
}

/**
 * 响应拦截器 - 统一错误处理
 */
const responseInterceptor = (response) => {
  const { statusCode, data } = response
  
  // 开发环境打印响应信息
  if (process.env.NODE_ENV === 'development') {
    console.log('【响应】', statusCode, data)
  }
  
  // HTTP 状态码处理
  if (statusCode === 200) {
    // 业务状态码处理
    // 你的后端业务状态码 200 表示成功，其他是错误
    if (data.code === 200) { // 保持与你的后端 API 文档一致
      return data // 返回完整后端 Result 结构 {code, message, data}
    } else if (data.code === 401) {
      // Token 过期，清除并跳转登录
      uni.removeStorageSync(TOKEN_KEY)
      uni.reLaunch({
        url: '/pages/login/index'
      })
      // Promise.reject 将错误传递给 .catch
      return Promise.reject(new Error(data.message || '登录已过期'))
    } else {
      // 其他业务错误
      uni.showToast({
        title: data.message || '请求失败',
        icon: 'none',
        duration: 2000
      })
      return Promise.reject(new Error(data.message || '业务错误'))
    }
  } else if (statusCode === 401) {
    uni.removeStorageSync(TOKEN_KEY)
    uni.reLaunch({
      url: '/pages/login/index'
    })
    return Promise.reject(new Error('未授权'))
  } else {
    uni.showToast({
      title: `请求错误 ${statusCode}`,
      icon: 'none'
    })
    return Promise.reject(new Error(`HTTP ${statusCode}`))
  }
}

/**
 * 核心请求方法 (原本的 executeRequest，现在作为主要 request 导出)
 */
const request = (config) => {
  return new Promise((resolve, reject) => {
    // 如果使用 Mock，直接返回 Mock 数据 (这个逻辑通常由 Mock 库自动处理)
    // 更好的做法是让 Mock 库拦截 uni.request，而不是在这里手动判断
    // 暂时保留你的 Mock 逻辑，但它可能与 better-mock/mock.js 行为重复
    if (USE_MOCK) {
        // 在小程序和 APP 环境下，Better-Mock 会拦截请求
        // 在 H5 环境下，Mock.js 会拦截请求
        // 所以这里可以简化，直接调用 uni.request，让 mock 库去处理拦截
        // 或者保留你的延迟模拟，但不需要手动 getMockData
        setTimeout(() => {
            // 应用请求拦截器
            const finalConfig = requestInterceptor({
                url: getBaseUrl() + config.url, // Mock URL
                method: config.method || 'GET',
                data: config.data || {},
                header: {
                    'Content-Type': 'application/json',
                    ...config.header
                },
                timeout: config.timeout || TIMEOUT
            })

            uni.request({
                ...finalConfig,
                success: (res) => {
                    Promise.resolve(responseInterceptor(res))
                        .then(resolve)
                        .catch(reject)
                },
                fail: (err) => {
                    console.error('Mock请求失败:', err)
                    uni.showToast({
                        title: 'Mock请求失败',
                        icon: 'none'
                    })
                    reject(err)
                }
            })
        }, 300); // 模拟 300ms 网络延迟
        return;
    }

    // 生产环境或 Mock 未开启时，执行实际请求
    // 应用请求拦截器
    const finalConfig = requestInterceptor({
      url: getBaseUrl() + config.url,
      method: config.method || 'GET',
      data: config.data || {},
      header: {
        'Content-Type': 'application/json',
        ...config.header
      },
      timeout: config.timeout || TIMEOUT
    })
    
    uni.request({
      ...finalConfig,
      success: (res) => {
        Promise.resolve(responseInterceptor(res))
          .then(resolve)
          .catch(reject)
      },
      fail: (err) => {
        console.error('请求失败:', err)
        uni.showToast({
          title: '网络请求失败',
          icon: 'none'
        })
        reject(err)
      }
    })
  })
}

/**
 * GET 请求
 */
export const get = (url, data = {}, config = {}) => {
  return request({
    url,
    method: 'GET',
    data,
    ...config
  })
}

/**
 * POST 请求
 */
export const post = (url, data = {}, config = {}) => {
  return request({
    url,
    method: 'POST',
    data,
    ...config
  })
}

/**
 * PUT 请求
 */
export const put = (url, data = {}, config = {}) => {
  return request({
    url,
    method: 'PUT',
    data,
    ...config
  })
}

/**
 * DELETE 请求
 */
export const del = (url, data = {}, config = {}) => {
  return request({
    url,
    method: 'DELETE',
    data,
    ...config
  })
}

/**
 * 文件上传
 */
export const upload = (filePath, uploadUrl, data = {}) => { // 增加 uploadUrl 参数
  return new Promise((resolve, reject) => {
    // Mock 环境下模拟上传
    if (USE_MOCK) {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '上传成功 (Mock)',
          data: {
              url: 'https://picsum.photos/400/600?random=' + Date.now(),
              originalName: 'mock_image.jpg',
              size: 12345,
              mimeType: 'image/jpeg',
              width: 400,
              height: 600,
              hash: 'mockhash'
          }
        })
      }, 500)
      return;
    }
    
    // 真实上传
    const token = uni.getStorageSync(TOKEN_KEY)
    
    uni.uploadFile({
      url: getBaseUrl() + uploadUrl, // 使用传入的 uploadUrl
      filePath,
      name: 'file', // 默认文件字段名，如果后端不是 'file'，需要调整
      formData: data,
      header: {
        'Authorization': token ? `Bearer ${token}` : ''
      },
      success: (res) => {
        const responseData = JSON.parse(res.data)
        if (responseData.code === 200) {
          resolve(responseData) // 返回整个响应数据，包含 code, message, data
        } else {
          uni.showToast({
            title: responseData.message || '上传失败',
            icon: 'none'
          })
          reject(new Error(responseData.message || '上传失败'))
        }
      },
      fail: (err) => {
        console.error('上传失败:', err)
        uni.showToast({ title: '上传失败', icon: 'none' })
        reject(err)
      }
    })
  })
}

// 默认导出核心 request 函数，方便某些地方直接 import request from '@/utils/request'
export default request;

/**
 * Token 管理
 */
export const setToken = (token) => {
  uni.setStorageSync(TOKEN_KEY, token)
}

export const getToken = () => {
  return uni.getStorageSync(TOKEN_KEY)
}

export const removeToken = () => {
  uni.removeStorageSync(TOKEN_KEY)
}

/**
 * 切换 Mock 模式（仅开发环境）
 */
export const toggleMock = (enabled) => {
  if (process.env.NODE_ENV === 'development') {
    USE_MOCK = enabled
    console.log(`Mock 模式已${enabled ? '启用' : '关闭'}`)
  }
}