// api/user.js
import request from '@/utils/request' // 假设你以后会有这个封装好的request
import mock from '@/mock/user'

// 开关：控制是否使用 Mock 数据
const USE_MOCK = true 

// 辅助函数：模拟 request 请求，保持和 uni.request 返回结构一致
const mockRequest = async (mockFn, params) => {
  try {
    const res = await mockFn(params)
    return res
  } catch (error) {
    throw error
  }
}

export const userApi = {
  // 登录
  login(data) {
    if (USE_MOCK) return mockRequest(mock.login, data)
    return request.post('/auth/login', data)
  },

  // 获取用户信息
  getUserInfo() {
    if (USE_MOCK) return mockRequest(mock.getUserInfo)
    return request.get('/users/me')
  },

  // 获取我的帖子
  getMyPosts(page = 1) {
    if (USE_MOCK) return mockRequest(mock.getMyPosts, page)
    return request.get('/users/me/posts', { page })
  },
  
  // 3.6 获取签到状态
  getCheckInStatus() {
    if (USE_MOCK) return mockRequest(mock.getCheckInStatus)
    return request.get('/users/me/checkin/status')
  },
  
  // 3.7 签到
  checkIn() {
    if (USE_MOCK) return mockRequest(mock.checkIn)
    return request.post('/users/me/checkin')
  }
}