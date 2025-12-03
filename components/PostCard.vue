<template>
  <view class="post-card" @click="handleClick">
    <!-- 图片 -->
    <view class="image-wrapper" v-if="post.images && post.images.length > 0">
      <image 
        :src="post.images[0].url" 
        mode="widthFix"
        class="post-image"
      />
      
      <!-- 图片数量标识 -->
      <view v-if="post.images.length > 1" class="image-count">
        <image class="icon" src="../static/logo.png" />
        <text>{{ post.images.length }}</text>
      </view>
      
      <!-- 视频标识 -->
      <view v-if="post.type === 'video'" class="video-flag">
        <image class="icon" src="../static/logo.png" />
      </view>
    </view>
    
    <!-- 内容 -->
    <view class="content">
      <!-- 标签 -->
      <view v-if="post.tag" class="tag">
        {{ post.tag }}
      </view>
      
      <!-- 标题/内容 -->
      <text class="title">{{ post.content }}</text>
      
      <!-- 商品价格（如果是闲置） -->
      <view v-if="post.price" class="price-wrapper">
        <view class="price-tag">在售</view>
        <text class="price">¥{{ post.price }}</text>
      </view>
    </view>
    
    <!-- 底部信息 -->
    <view class="footer">
      <!-- 用户信息 -->
      <view class="user-info">
        <image :src="post.userAvatar" class="avatar" mode="aspectFill" />
        <text class="nickname">{{ post.userName }}</text>
        <image v-if="post.userLevel" class="level-badge" :src="getLevelIcon(post.userLevel)" />
      </view>
      
      <!-- 互动数据 -->
      <view class="actions">
        <view class="action-item">
          <image class="icon" src="../static/logo.png" />
          <text>{{ formatCount(post.viewCount) }}</text>
        </view>
        
        <view class="action-item">
          <image class="icon" src="../static/logo.png" />
          <text>{{ formatCount(post.commentCount) }}</text>
        </view>
        
        <view class="action-item" @click.stop="handleLike">
          <image 
            class="icon" 
            :src="post.isLiked ? '../static/logo.png' : '../static/logo.png'" 
          />
          <text :class="{ liked: post.isLiked }">{{ formatCount(post.likeCount) }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { postApi } from '@/api'

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click'])

// 处理点击
const handleClick = () => {
  emit('click', props.post)
}

// 处理点赞
const handleLike = async () => {
  try {
    await postApi.toggleLike(props.post.id)
    props.post.isLiked = !props.post.isLiked
    props.post.likeCount += props.post.isLiked ? 1 : -1
  } catch (error) {
    console.error('点赞失败:', error)
  }
}

// 格式化数字
const formatCount = (count) => {
  if (!count) return 0
  if (count < 10000) return count
  return (count / 10000).toFixed(1) + 'w'
}

// 获取等级图标
const getLevelIcon = (level) => {
  return `../static/icons/logo.png`
}
</script>

<style lang="scss" scoped>
.post-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.image-wrapper {
  position: relative;
  width: 100%;
}

.post-image {
  width: 100%;
  display: block;
}

.image-count {
  position: absolute;
  top: 16rpx;
  right: 16rpx;
  padding: 8rpx 16rpx;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
  
  .icon {
    width: 24rpx;
    height: 24rpx;
  }
  
  text {
    font-size: 22rpx;
    color: #FFFFFF;
  }
}

.video-flag {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80rpx;
  height: 80rpx;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .icon {
    width: 40rpx;
    height: 40rpx;
  }
}

.content {
  padding: 20rpx;
}

.tag {
  display: inline-block;
  padding: 6rpx 16rpx;
  background: #D4F4DD;
  color: #52C41A;
  font-size: 22rpx;
  border-radius: 6rpx;
  margin-bottom: 12rpx;
}

.title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  font-size: 28rpx;
  line-height: 1.5;
  color: #333333;
}

.price-wrapper {
  display: flex;
  align-items: center;
  margin-top: 16rpx;
  gap: 12rpx;
}

.price-tag {
  padding: 4rpx 12rpx;
  background: #FFF7E6;
  color: #FA8C16;
  font-size: 20rpx;
  border-radius: 6rpx;
}

.price {
  font-size: 32rpx;
  font-weight: 600;
  color: #FF4D4F;
}

.footer {
  padding: 16rpx 20rpx;
  border-top: 1rpx solid #F0F0F0;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.avatar {
  width: 44rpx;
  height: 44rpx;
  border-radius: 50%;
  margin-right: 12rpx;
}

.nickname {
  font-size: 24rpx;
  color: #666666;
  margin-right: 8rpx;
}

.level-badge {
  width: 32rpx;
  height: 16rpx;
}

.actions {
  display: flex;
  align-items: center;
  gap: 32rpx;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  
  .icon {
    width: 28rpx;
    height: 28rpx;
  }
  
  text {
    font-size: 24rpx;
    color: #999999;
    
    &.liked {
      color: #FF4D4F;
    }
  }
}
</style>