// api/index.js - API 接口统一管理

import { get, post, put, del, upload } from '@/utils/request'

/**
 * ========== 用户相关 ==========
 */
export const userApi = {
  // 登录
  login: (data) => post('/user/login', data),
  
  // 获取用户信息
  getUserInfo: () => get('/user/info'),
  
  // 更新用户信息
  updateUserInfo: (data) => put('/user/info', data),
  
  // 获取用户详情
  getUserDetail: (userId) => get(`/user/${userId}`)
}

/**
 * ========== 帖子相关 ==========
 */
export const postApi = {
  // 获取帖子列表（瀑布流）
  getPostList: (params) => get('/post/list', params),
  
  // 获取帖子详情
  getPostDetail: (postId) => get(`/post/${postId}`),
  
  // 发布帖子
  publishPost: (data) => post('/post/publish', data),
  
  // 删除帖子
  deletePost: (postId) => del(`/post/${postId}`),
  
  // 点赞/取消点赞
  toggleLike: (postId) => post(`/post/${postId}/like`),
  
  // 收藏/取消收藏
  toggleCollect: (postId) => post(`/post/${postId}/collect`)
}

/**
 * ========== 评论相关 ==========
 */
export const commentApi = {
  // 获取评论列表
  getCommentList: (postId, params) => get(`/comment/${postId}`, params),
  
  // 发表评论
  addComment: (data) => post('/comment/add', data),
  
  // 删除评论
  deleteComment: (commentId) => del(`/comment/${commentId}`),
  
  // 评论点赞
  likeComment: (commentId) => post(`/comment/${commentId}/like`)
}

/**
 * ========== 聊天相关 ==========
 */
export const chatApi = {
  // 获取会话列表
  getConversationList: () => get('/chat/conversation/list'),
  
  // 获取聊天记录
  getChatHistory: (conversationId, params) => get(`/chat/history/${conversationId}`, params),
  
  // 发送消息（HTTP）
  sendMessage: (data) => post('/chat/send', data),
  
  // 删除会话
  deleteConversation: (conversationId) => del(`/chat/conversation/${conversationId}`),
  
  // 标记已读
  markAsRead: (conversationId) => post(`/chat/read/${conversationId}`)
}

/**
 * ========== 话题相关 ==========
 */
export const topicApi = {
  // 获取热门话题
  getHotTopics: () => get('/topic/hot'),
  
  // 搜索话题
  searchTopic: (keyword) => get('/topic/search', { keyword }),
  
  // 话题详情
  getTopicDetail: (topicId) => get(`/topic/${topicId}`)
}

/**
 * ========== 上传相关 ==========
 */
export const uploadApi = {
  // 上传图片
  uploadImage: (filePath) => upload(filePath, { type: 'image' }),
  
  // 上传视频
  uploadVideo: (filePath) => upload(filePath, { type: 'video' })
}

/**
 * ========== 搜索相关 ==========
 */
export const searchApi = {
  // 综合搜索
  search: (keyword, params) => get('/search', { keyword, ...params }),
  
  // 搜索用户
  searchUser: (keyword) => get('/search/user', { keyword }),
  
  // 搜索帖子
  searchPost: (keyword) => get('/search/post', { keyword })
}

// 默认导出所有 API
export default {
  userApi,
  postApi,
  commentApi,
  chatApi,
  topicApi,
  uploadApi,
  searchApi
}