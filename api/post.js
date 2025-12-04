// api/post.js

import { delay, postsDetailData, commentsData } from '../mock/post.js';

const USE_MOCK = true;

/**
 * 获取帖子详情
 * @param {Number} postId 
 */
export const getPostDetail = async (postId) => {
  if (USE_MOCK) {
    await delay(300);
    const post = postsDetailData[postId];
    if (post) {
      return { code: 200, data: post, message: 'success' };
    } else {
      return { code: 404, data: null, message: '帖子不存在' };
    }
  }
  // 真实请求
  // return request({ url: `/posts/${postId}` });
};

/**
 * 获取帖子评论列表
 * @param {Number} postId 
 */
export const getPostComments = async (postId) => {
  if (USE_MOCK) {
    await delay(200);
    const comments = commentsData[postId] || [];
    return { 
      code: 200, 
      data: {
        list: comments,
        total: comments.length
      }, 
      message: 'success' 
    };
  }
};

/**
 * 点赞帖子
 * @param {Number} postId 
 * @param {Boolean} isLike 
 */
export const likePost = async (postId, isLike) => {
  if (USE_MOCK) {
    await delay(150);
    return { code: 200, data: { isLiked: isLike }, message: 'success' };
  }
};

/**
 * 收藏帖子
 * @param {Number} postId 
 * @param {Boolean} isCollect 
 */
export const collectPost = async (postId, isCollect) => {
  if (USE_MOCK) {
    await delay(150);
    return { code: 200, data: { isCollected: isCollect }, message: 'success' };
  }
};

/**
 * 发表评论
 * @param {Object} data - { postId, content, replyTo }
 */


/**
 * 点赞评论
 * @param {Number} commentId 
 * @param {Boolean} isLike 
 */
export const likeComment = async (commentId, isLike) => {
  if (USE_MOCK) {
    await delay(100);
    return { code: 200, data: { isLiked: isLike }, message: 'success' };
  }
};
// api/post.js

// 举报帖子
export function reportPost(postId, reason) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`举报帖子 ${postId}，原因: ${reason}`);
      resolve({
        code: 200,
        message: '举报成功'
      });
    }, 300);
  });
}

// 举报评论
export function reportComment(commentId, reason) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`举报评论 ${commentId}，原因: ${reason}`);
      resolve({
        code: 200,
        message: '举报成功'
      });
    }, 300);
  });
}

// 添加评论（增强版）
export function addComment(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newComment = {
        id: Date.now(),
        postId: data.postId,
        userId: 999,
        username: '当前用户',
        avatar: 'https://via.placeholder.com/80',
        level: 'LV.5',
        content: data.content,
        time: '刚刚',
        likes: 0,
        isLiked: false,
        isAuthor: false,
        isMine: true
      };
      
      // 如果是回复，添加回复信息
      if (data.replyToUsername) {
        newComment.replyTo = data.replyToUsername;
        newComment.isOP = false; // 可以根据实际情况判断
      }
      
      resolve({
        code: 200,
        data: newComment,
        message: '评论成功'
      });
    }, 300);
  });
}
// 发布帖子
export function publishPost(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟生成新帖子
      const newPost = {
        id: Date.now(),
        userId: 999,
        userAvatar: 'https://via.placeholder.com/80',
        userName: '当前用户',
        userLevel: 'v3',
        time: '刚刚',
        topicId: data.topicId,
        topicName: data.topicName,
        content: data.content,
        images: data.images || [],
        views: 0,
        comments: 0,
        likes: 0,
        shares: 0,
        isAnonymous: data.isAnonymous || false
      };
      
      // 如果是闲置，添加商品信息
      if (data.product) {
        newPost.product = {
          price: data.product.price,
          tradeMethod: data.product.tradeMethod,
          status: 'selling'
        };
      }
      
      // 如果是投票，添加投票信息
      if (data.vote) {
        newPost.vote = {
          options: data.vote.options.map((opt, index) => ({
            id: index + 1,
            text: opt,
            count: 0
          })),
          totalVotes: 0,
          isVoted: false
        };
      }
      
      console.log('发布帖子:', newPost);
      
      resolve({
        code: 200,
        data: newPost,
        message: '发布成功'
      });
    }, 500);
  });
}