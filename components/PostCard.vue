<template>
  <view class="post-card">
    <!-- 帖子头部 -->
    <view class="post-header">
      <view class="user-info" @click="handleUserClick">
        <view class="user-avatar">{{ post.userAvatar }}</view>
        <view class="user-detail">
          <view class="user-name-row">
            <text class="user-name">{{ post.userName }}</text>
            <text class="user-level">{{ post.userLevel }}</text>
          </view>
          <text class="post-time">{{ post.time }}</text>
        </view>
      </view>
      <text class="post-more" @click="handleMoreClick">⋮</text>
    </view>

    <!-- 帖子内容 -->
    <view class="post-content" @click="handlePostClick">
      <view class="post-tag" v-if="post.tag">
        <text>{{ post.tag }}</text>
      </view>
      <text class="post-text">{{ post.content }}</text>
    </view>

    <!-- 帖子图片 -->
    <view class="post-images" v-if="post.images && post.images.length > 0">
      <view 
        class="image-item" 
        v-for="(img, index) in post.images" 
        :key="index"
        :style="{ backgroundColor: img }"
        @click="handleImageClick(index)"
      >
      </view>
    </view>

    <!-- 商品信息 -->
    <view class="product-info" v-if="post.product" @click="handleProductClick">
      <text class="product-tag">🛒 在售</text>
      <text class="product-price">价格: ¥{{ post.product.price }}</text>
    </view>

    <!-- 帖子底部互动 -->
    <view class="post-footer">
      <view class="footer-item">
        <text class="icon">👁</text>
        <text>{{ formatNumber(post.views) }}</text>
      </view>
      <view class="footer-item" @click="handleCommentClick">
        <text class="icon">💬</text>
        <text>{{ formatNumber(post.comments) }}</text>
      </view>
      <view class="footer-item" @click="handleLikeClick">
        <text class="icon">{{ isLiked ? '❤️' : '👍' }}</text>
        <text>{{ formatNumber(post.likes) }}</text>
      </view>
      <view class="footer-item" @click="handleCommentClick">
        <text class="icon">💬</text>
        <text>评论</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'PostCard',
  props: {
    post: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  data() {
    return {
      isLiked: false
    };
  },
  methods: {
    // 格式化数字显示
    formatNumber(num) {
      if (!num) return '0';
      const n = parseInt(num);
      if (n >= 10000) {
        return (n / 10000).toFixed(1) + '万';
      }
      return num;
    },
    
    // 点击用户头像/名称
    handleUserClick() {
      this.$emit('user-click', this.post);
    },
    
    // 点击更多按钮
    handleMoreClick() {
      this.$emit('more-click', this.post);
    },
    
    // 点击帖子内容
    handlePostClick() {
      this.$emit('post-click', this.post);
    },
    
    // 点击图片
    handleImageClick(index) {
      this.$emit('image-click', { post: this.post, imageIndex: index });
    },
    
    // 点击商品
    handleProductClick() {
      this.$emit('product-click', this.post);
    },
    
    // 点击评论
    handleCommentClick() {
      this.$emit('comment-click', this.post);
    },
    
    // 点击点赞
    handleLikeClick() {
      this.isLiked = !this.isLiked;
      this.$emit('like-click', { post: this.post, isLiked: this.isLiked });
    }
  }
};
</script>

<style scoped>
.post-card {
  background-color: #fff;
  border-radius: 15rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  margin-right: 20rpx;
}

.user-detail {
  display: flex;
  flex-direction: column;
}

.user-name-row {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.user-name {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
}

.user-level {
  font-size: 20rpx;
  color: #ff9800;
  background-color: #fff3e0;
  padding: 2rpx 8rpx;
  border-radius: 8rpx;
}

.post-time {
  font-size: 24rpx;
  color: #999;
  margin-top: 5rpx;
}

.post-more {
  font-size: 40rpx;
  color: #999;
  padding: 10rpx;
}

.post-content {
  margin-bottom: 20rpx;
}

.post-tag {
  display: inline-block;
  padding: 4rpx 12rpx;
  background-color: #e8f5e9;
  color: #4caf50;
  border-radius: 8rpx;
  font-size: 22rpx;
  margin-right: 10rpx;
  margin-bottom: 10rpx;
}

.post-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
}

.post-images {
  display: flex;
  gap: 10rpx;
  margin-bottom: 20rpx;
}

.image-item {
  width: 200rpx;
  height: 200rpx;
  border-radius: 10rpx;
  background-color: #f0f0f0;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 15rpx;
  background-color: #fffef0;
  border-radius: 10rpx;
  margin-bottom: 20rpx;
}

.product-tag {
  font-size: 24rpx;
  color: #8bc34a;
}

.product-price {
  font-size: 28rpx;
  color: #f44336;
  font-weight: bold;
}

.post-footer {
  display: flex;
  justify-content: space-around;
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;
}

.footer-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 24rpx;
  color: #666;
  padding: 10rpx 15rpx;
}

.footer-item:active {
  background-color: #f5f5f5;
  border-radius: 10rpx;
}

.footer-item .icon {
  font-size: 28rpx;
}
</style>