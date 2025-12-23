// api/user.js
import request from '@/utils/request' // 假设你以后会有这个封装好的request
import mock from '@/mock/user'

// 开关：控制是否使用 Mock 数据
const USE_MOCK = false 

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
  // 2.2 用户登录 (U02)
    login(data) {
      if (USE_MOCK) return mockRequest(mock.login, data)
      // 真实接口: POST /auth/login
      // 注意：后端文档要求 username 字段 (即使输入的是 email)
      return request.post('/auth/login', {
        username: data.username, 
        password: data.password
      })
    },
	 // 2.1 用户注册 (U01) - 新增真实接口绑定
	  register(data) {
	    if (USE_MOCK) return mockRequest(mock.register, data) // Mock里可能没写，但这不重要了
	    // 真实接口: POST /auth/register
	    return request.post('/auth/register', {
	      username: data.username,
	      email: data.email,
	      password: data.password
	    })
	  },
	   // 2.3 退出登录 (U05)
	    logout() {
	      // 退出不需要 mock，直接调接口
	      if (USE_MOCK) return Promise.resolve({ code: 200 }) 
	      return request.post('/auth/logout')
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
  },
  // 获取我的跑腿
    getMyErrands(type = 'published') {
      if (USE_MOCK) return mockRequest(mock.getMyErrands, { type })
      return request.get('/users/me/errands', { type })
    },
  
    // 获取关注列表
    getFollowList(userId) {
      if (USE_MOCK) return mockRequest(mock.getFollowList, userId)
      return request.get(`/users/${userId}/following`)
    },
  
    // 获取他人信息
    getUserProfile(userId) {
      if (USE_MOCK) return mockRequest(mock.getUserProfile, userId)
      return request.get(`/users/${userId}`)
    },
  
    // 关注操作 (isFollow: true关注, false取关)
    toggleFollow(userId, isFollow) {
      if (USE_MOCK) return mockRequest(mock.toggleFollow, userId)
      const method = isFollow ? 'POST' : 'DELETE'
      return request({ url: `/users/${userId}/follow`, method })
    },
	  // 3.4 我的帖子
	  getMyPosts(page = 1) {
	    if (USE_MOCK) return mockRequest(mock.getMyPosts, page)
	    return request.get('/users/me/posts', { page })
	  },
	
	  // 3.12 我的收藏
	  getMyCollections(page = 1) {
	    if (USE_MOCK) return mockRequest(mock.getMyCollections, page)
	    return request.get('/users/me/collections', { page }) // 或 /collects
	  },
	
	  // 3.9 获取粉丝列表
	  getFollowers(userId) {
	    if (USE_MOCK) return mockRequest(mock.getFollowers, userId)
	    return request.get(`/users/${userId}/followers`)
	  },

  
}