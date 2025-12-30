// utils/request.js - 支持 Mock 的网络请求封装

// ==================== 配置区 ====================

// 是否使用 Mock 数据（开发时设为 true，打包前改为 false）
let USE_MOCK = false

// 真实后端地址
const BASE_URL = 'http://120.26.30.91:8080/api'

// Mock 地址（本地）
const MOCK_URL = '/api'

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
    if (data.code === 0 || data.code === 200) {
      return data // 返回完整后端 Result 结构
    } else if (data.code === 401) {
      // Token 过期，清除并跳转登录
      uni.removeStorageSync(TOKEN_KEY)
      uni.reLaunch({
        url: '/pages/login/index'
      })
      return Promise.reject(new Error('登录已过期'))
    } else {
      // 其他业务错误
      uni.showToast({
        title: data.message || '请求失败',
        icon: 'none',
        duration: 2000
      })
      return Promise.reject(new Error(data.message))
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
 * 核心请求方法
 */
const request = (config) => {
  return new Promise((resolve, reject) => {
    // 如果使用 Mock，直接返回 Mock 数据
    if (USE_MOCK) {
      // 延迟模拟网络请求
      setTimeout(() => {
        // 构造 Mock URL
        const mockUrl = config.url
        
        // 在小程序和 APP 环境下，Better-Mock 会拦截请求
        // 在 H5 环境下，Mock.js 会拦截请求
        
        // 这里我们手动调用 Mock 数据（可选，取决于你的 Mock 配置）
        try {
          const mockData = getMockData(mockUrl, config.method, config.data)
          
          if (mockData) {
            console.log('【Mock 数据】', mockData)
            
            if (mockData.code === 0 || mockData.code === 200) {
              resolve(mockData.data)
            } else {
              uni.showToast({
                title: mockData.message || 'Mock 请求失败',
                icon: 'none'
              })
              reject(new Error(mockData.message))
            }
            return
          }
        } catch (error) {
          console.error('Mock 数据获取失败:', error)
        }
        
        // 如果 Mock 数据不存在，走正常请求流程
        executeRequest(config, resolve, reject)
      }, 300) // 模拟 300ms 网络延迟
    } else {
      // 生产环境直接请求
      executeRequest(config, resolve, reject)
    }
  })
}

/**
 * 执行实际的网络请求
 */
const executeRequest = (config, resolve, reject) => {
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
}

/**
 * 获取 Mock 数据（简化版，实际由 Better-Mock 自动处理）
 * 这个函数是可选的，如果你的 Mock 配置正确，可以删除
 */
const getMockData = (url, method, data) => {
  // 这里可以根据 URL 返回对应的 Mock 数据
  // 但通常 Better-Mock 会自动拦截并返回，无需手动实现
  return null
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
export const upload = (filePath, data = {}) => {
  return new Promise((resolve, reject) => {
    // Mock 环境下模拟上传
    if (USE_MOCK) {
      setTimeout(() => {
        resolve({
          url: 'https://picsum.photos/400/600?random=' + Date.now(),
          width: 400,
          height: 600
        })
      }, 500)
      return
    }
    
    // 真实上传
    const token = uni.getStorageSync(TOKEN_KEY)
    
    uni.uploadFile({
      url: BASE_URL + '/upload',
      filePath,
      name: 'file',
      formData: data,
      header: {
        'Authorization': token ? `Bearer ${token}` : ''
      },
      success: (res) => {
        const data = JSON.parse(res.data)
        if (data.code === 0) {
          resolve(data.data)
        } else {
          uni.showToast({
            title: data.message || '上传失败',
            icon: 'none'
          })
          reject(new Error(data.message))
        }
      },
      fail: reject
    })
  })
}

// 默认导出，兼容现有调用方式
export default {
  get,
  post,
  put,
  del,
  upload
}

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
