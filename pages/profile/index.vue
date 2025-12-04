<template>
  <view class="page-container">
    <view class="profile-header">
      <view class="user-card">
        <view class="avatar-large">👤</view>
        <view class="info">
          <text class="username">未登录用户</text>
          <text class="desc">点击登录开启校园生活</text>
        </view>
      </view>
      <view class="stats">
        <view class="stat-item"><text class="num">0</text><text>获赞</text></view>
        <view class="stat-item"><text class="num">0</text><text>关注</text></view>
        <view class="stat-item"><text class="num">0</text><text>粉丝</text></view>
      </view>
    </view>

    <view class="menu-list">
      <view class="menu-item">我的发布</view>
      <view class="menu-item">我的跑腿</view>
      <view class="menu-item">收藏夹</view>
      <view class="menu-item">设置</view>
    </view>

    <TabBar current-tab="profile" />
  </view>
</template>

<script setup>
import TabBar from '@/components/TabBar.vue'
import { onShow } from '@dcloudio/uni-app'

onShow(() => {
  uni.hideTabBar()
})
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background: #F5F5F5;
  padding-bottom: 160rpx;
}
.profile-header {
  background: #fff;
  padding: 100rpx 40rpx 40rpx;
  margin-bottom: 20rpx;
}
.user-card {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;
}
.avatar-large {
  width: 140rpx;
  height: 140rpx;
  background: #eee;
  border-radius: 50%;
  margin-right: 30rpx;
  font-size: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.info { display: flex; flex-direction: column; }
.username { font-size: 40rpx; font-weight: bold; margin-bottom: 10rpx; }
.desc { color: #999; font-size: 28rpx; }
.stats { display: flex; justify-content: space-around; }
.stat-item { display: flex; flex-direction: column; align-items: center; }
.num { font-weight: bold; font-size: 32rpx; margin-bottom: 6rpx; }

.menu-list { background: #fff; padding: 0 30rpx; }
.menu-item {
  padding: 30rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
  font-size: 30rpx;
}
</style>