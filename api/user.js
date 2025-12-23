// api/user.js
// 导入 utils/request.js 中具名导出的方法
import { get, post, put, del } from '@/utils/request' 
// 为了文件上传，你可能需要导入 upload
import { upload as commonUpload } from '@/utils/request'


// --- API 定义 ---
export const userApi = {
  // 登录 (U02)
  login(data) {
    return post('/api/auth/login', data)
  },
  
  // 注册 (U01)
  register(data) {
    return post('/api/auth/register', data)
  },

  // 退出登录 (U05)
  logout() {
    return post('/api/auth/logout')
  },

  // 获取当前用户信息 (U03)
  getUserInfo() {
    return get('/api/users/me')
  },

  // 更新个人资料 (U03)
  updateProfile(data) {  
    return put('/api/users/me', data)  
  },

  // 获取指定用户主页信息 (U10)
  getUserProfile(id) {
    return get(`/api/users/${id}`)
  },
  
  // 获取指定用户的帖子列表 (S17)
  getUserPosts(id, params) { // 增加 params 参数支持分页
    return get(`/api/users/${id}/posts`, params)
  },

  // 获取我的帖子列表 (U05)
  getMyPosts(params) { // 增加 params 参数支持分页
    return get('/api/users/me/posts', params)  
  },

  // 获取我的收藏列表 (U06)
  getMyCollections(params) { // 增加 params 参数支持分页
    return get('/api/users/me/collects', params)
  },

  // 获取我的跑腿列表 (Users - 补充跑腿列表接口)
  // 注意：这里的 type 是 Query 参数，应在 URL 中传递
  getMyErrands(type, params) {  // 增加 type 和 params 参数
    return get(`/api/users/me/errands`, { type, ...params })  
  },

  // 关注/取关 (U11)
  toggleFollow(userId, isFollow) {
    return isFollow ? post(`/api/users/${userId}/follow`) : del(`/api/users/${userId}/follow`)
  },

  // 获取粉丝列表 (U09)
  getFollowers(userId, params) { // 增加 params 参数支持分页
    return get(`/api/users/${userId}/followers`, params)
  },
  
  // 获取关注列表 (U09)
  getFollowList(userId, params) { // 增加 params 参数支持分页 
    return get(`/api/users/${userId}/following`, params)  
  },  
      
  // 签到 (U04)
  checkIn() {  
    return post('/api/users/me/checkin')  
  },  
    
  // 获取签到状态 (U04)
  getCheckInStatus() {  
    return get('/api/users/me/checkin/status')  
  },

  // -------------------------------------------------------------
  // 通用模块 (Common) - 新增文件上传接口
  // 假设头像上传 URL 为 /api/common/upload
  // 假设帖子图片上传 URL 为 /api/common/upload/batch
  uploadAvatar(filePath, data = {}) {
      return commonUpload(filePath, '/api/common/upload', data);
  },
  uploadPostImages(filePath, data = {}) {
      // 这里的 data 可以包含 scene 等额外参数，upload 函数会将其作为 formData 传递
      return commonUpload(filePath, '/api/common/upload/batch', data);
  }
}

// 补充管理员模块 API 定义
// 如果 adminApi 不在 userApi 内部，你需要单独创建 api/admin.js 文件
// 示例 api/admin.js
export const adminApi = {
    // 获取待审核举报列表 (Admin - 7.1)
    getReports: (status = 'PENDING', params) => {
        return get(`/api/admin/reports`, { status, ...params });
    },
    // 处理举报 (Admin - 7.2)
    processReport: (reportId, action, note) => {
        return post(`/api/admin/reports/${reportId}/process`, { action, note });
    }
};

