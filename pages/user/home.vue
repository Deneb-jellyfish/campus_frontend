<template>
  <view class="user-home" v-if="userInfo">
    <!-- 头部背景 -->
    <view class="header-bg"></view>
    
    <view class="profile-card">
      <view class="top-row">
        <view class="avatar">👤</view>
        <button 
          class="follow-btn" 
          :class="{ active: userInfo.isFollowing }"
          @click="handleFollow"
        >
          {{ userInfo.isFollowing ? '已关注' : '+ 关注' }}
        </button>
      </view>
      
      <view class="info-block">
        <view class="name">{{ userInfo.nickname }}</view>
        <view class="school">{{ userInfo.school || '未知学院' }}</view>
        <view class="bio">{{ userInfo.bio }}</view>
      </view>
      
      <view class="stats-row">
              <!-- 修改：获赞 -> 粉丝 -->
              <view class="stat-item" @click="handleFollowers">
                <text class="num">{{ userStore.userInfo.stats?.followers || 0 }}</text>
                <text class="label">粉丝</text>
              </view>

        <view class="stat">
          <text class="num">{{ userInfo.stats.following }}</text>
          <text class="label">关注</text>
        </view>
        <view class="stat">
          <text class="num">{{ userInfo.stats.followers }}</text>
          <text class="label">粉丝</text>
        </view>
      </view>
    </view>
    
    <!-- 他的动态 (简单占位) -->
    <view class="posts-section">
      <view class="section-title">Ta的动态</view>
      <view class="empty-tip">暂无公开动态</view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { userApi } from '@/api/user'

const userInfo = ref(null)
const userId = ref('')

onLoad((options) => {
  userId.value = options.id
  loadData()
})

const loadData = async () => {
  try {
    const res = await userApi.getUserProfile(userId.value)
    if (res.code === 200) {
      userInfo.value = res.data
    }
  } catch (e) {
    uni.showToast({ title: '用户不存在', icon: 'none' })
    setTimeout(() => uni.navigateBack(), 1000)
  }
}

const handleFollow = async () => {
  const newState = !userInfo.value.isFollowing
  try {
    await userApi.toggleFollow(userId.value, newState)
    userInfo.value.isFollowing = newState
    uni.showToast({ title: newState ? '已关注' : '已取消', icon: 'none' })
  } catch (e) {
    uni.showToast({ title: '操作失败', icon: 'none' })
  }
}
</script>

<style scoped>
.user-home { min-height: 100vh; background: #F5F5F5; }
.header-bg { height: 200rpx; background: linear-gradient(135deg, #a8e6cf 0%, #dcedc1 100%); }
.profile-card { background: #fff; margin: -100rpx 30rpx 30rpx; border-radius: 20rpx; padding: 30rpx; position: relative; }

.top-row { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 20rpx; }
.avatar { width: 140rpx; height: 140rpx; border-radius: 50%; border: 4rpx solid #fff; background: #eee; display: flex; justify-content: center; align-items: center; font-size: 60rpx; transform: translateY(-40rpx); margin-bottom: -40rpx; }
.follow-btn { margin: 0; font-size: 26rpx; background: #52C41A; color: #fff; border-radius: 30rpx; padding: 0 30rpx; height: 60rpx; line-height: 60rpx; }
.follow-btn.active { background: #f0f0f0; color: #999; }

.info-block { margin-bottom: 30rpx; }
.name { font-size: 40rpx; font-weight: bold; margin-bottom: 8rpx; }
.school { font-size: 24rpx; color: #666; background: #f5f5f5; display: inline-block; padding: 4rpx 12rpx; border-radius: 8rpx; margin-bottom: 16rpx; }
.bio { font-size: 28rpx; color: #666; }

.stats-row { display: flex; justify-content: space-around; border-top: 1rpx solid #f5f5f5; padding-top: 20rpx; }
.stat { display: flex; flex-direction: column; align-items: center; }
.num { font-weight: bold; font-size: 32rpx; }
.label { font-size: 24rpx; color: #999; }

.posts-section { margin: 0 30rpx; background: #fff; border-radius: 20rpx; padding: 30rpx; min-height: 300rpx; }
.section-title { font-weight: bold; margin-bottom: 20rpx; }
.empty-tip { text-align: center; color: #ccc; margin-top: 60rpx; }
</style>