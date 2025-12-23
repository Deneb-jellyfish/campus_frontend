import { useUserStore } from '@/stores/user'

// ✅ 电脑调试用 localhost，手机调试请改成本机局域网 IP (如 http://192.168.1.5:8080)
const BASE_URL = 'http://localhost:8080'

// --- 封装请求函数 ---
const request = (options) => {
  const userStore = useUserStore()
  
  const header = {
    'Content-Type': 'application/json',
    ...options.header
  }
  
  if (userStore.token) {
    header['Authorization'] = `Bearer ${userStore.token}`
  }

  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: header,
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
        } else {
          // 401 未登录处理可在此处添加
          reject(res.data || { message: '请求失败' })
        }
      },
      fail: (err) => {
        console.error('API请求网络错误:', err)
        reject({ message: '网络连接失败，请检查后端' })
      }
    })
  })
}

// --- API 定义 ---
export const userApi = {
  // 登录
  login(data) {
    return request({ url: '/api/auth/login', method: 'POST', data })
  },
  
  // 注册
  register(data) {
    return request({ url: '/api/auth/register', method: 'POST', data })
  },

  // 获取登录用户信息 (我的)
  getUserInfo() {
    return request({ url: '/api/users/me', method: 'GET' })
  },

  // ✅ 获取指定用户主页信息 (支持查自己或他人)
  getUserProfile(id) {
    return request({ url: `/api/users/${id}`, method: 'GET' })
  },
  
  // ✅🔥 新增：获取指定用户的帖子列表
  // 后端需要对应实现 GET /api/users/{id}/posts 接口
  getUserPosts(id) {
    return request({ url: `/api/users/${id}/posts`, method: 'GET' })
  },

  // 关注/取关
  toggleFollow(userId, isFollow) {
    return request({
      url: `/api/users/${userId}/follow`,
      method: isFollow ? 'POST' : 'DELETE'
    })
  },

  // 获取粉丝列表
  getFollowers(userId) {
    return request({ url: `/api/users/${userId}/followers`, method: 'GET' })
  },
  
  // 获取关注列表
  getFollowList(userId) {  
    return request({ url: `/api/users/${userId}/following`, method: 'GET' })  
  },  
      
  // 签到 - 使用正确的后端路径  
  checkIn() {  
    return request({ url: '/api/users/me/checkin', method: 'POST' })  
  },  
    
  // 新增的获取签到状态方法  
  getCheckInStatus() {  
    return request({ url: '/api/users/me/checkin/status', method: 'GET' })  
  },
  getMyPosts() {  
    return request({ url: '/api/users/me/posts', method: 'GET' })  
  },
  getMyErrands(type) {  
    return request({ url: `/api/users/me/errands?type=${type}`, method: 'GET' })  
  },
  updateProfile(data) {  
    return request({ url: '/api/users/me', method: 'PUT', data })  
  },
  getMyCollections(params = { page: 1, size: 10 }) {
      return request({
        url: '/api/users/me/collects', // 修正为文档中的 collects
        method: 'GET',
        data: params 
      })
    }
}
export const adminApi = {
  // [修正] status 默认为 0 (数字)，且使用 request({ ... }) 写法
  getReports: (status = 0) => {
    return request({
      url: '/api/admin/reports',
      method: 'GET',
      data: { status }
    })
  },

  // [修正] 处理举报
  processReport: (id, action, note) => {
    return request({
      url: `/api/admin/reports/${id}/process`,
      method: 'POST',
      data: { action, note }
    })
  }
}