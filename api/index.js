// api/index.js

import { delay, topicsData, categoriesData, postsData } from '@/mock/index.js';

// 是否使用 mock 数据（上线时改为 false）
const USE_MOCK = true;

// 真实 API 基础地址
const BASE_URL = 'https://your-api.com/api';

/**
 * 封装请求方法
 */
const request = (options) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${getToken()}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: reject
    });
  });
};

/**
 * 获取热门话题
 */
export const getHotTopics = async () => {
  if (USE_MOCK) {
    await delay(200);
    return { code: 200, data: topicsData, message: 'success' };
  }
  return request({ url: '/topics/hot' });
};

/**
 * 获取分类列表
 */
export const getCategories = async () => {
  if (USE_MOCK) {
    await delay(100);
    return { code: 200, data: categoriesData, message: 'success' };
  }
  return request({ url: '/categories' });
};

/**
 * 获取帖子列表
 * @param {Object} params - { categoryId, page, pageSize }
 */
export const getPosts = async (params = {}) => {
  if (USE_MOCK) {
    await delay(300);
    
    let result =postsData; 
    
    // 按分类筛选
    if (params.categoryId && params.categoryId !== 0) {
      result = result.filter(post => post.categoryId === params.categoryId);
    }
    
    // 模拟分页
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    return { 
      code: 200, 
      data: {
        list: result.slice(start, end),
        total: result.length,
        page,
        pageSize,
        hasMore: end < result.length
      },
      message: 'success' 
    };
  }
  return request({ url: '/posts', data: params });
};

/**
 * 点赞/取消点赞
 * @param {Number} postId 
 * @param {Boolean} isLike 
 */
export const toggleLike = async (postId, isLike) => {
  if (USE_MOCK) {
    await delay(150);
    return { code: 200, data: { isLiked: isLike }, message: 'success' };
  }
  return request({ 
    url: `/posts/${postId}/like`, 
    method: 'POST',
    data: { isLike }
  });
};

/**
 * 搜索帖子
 * @param {String} keyword 
 */
export const searchPosts = async (keyword) => {
  if (USE_MOCK) {
    await delay(300);
    const result = postsData.filter(post => 
      post.content.includes(keyword) || post.userName.includes(keyword)
    );
    return { code: 200, data: result, message: 'success' };
  }
  return request({ url: '/posts/search', data: { keyword } });
};