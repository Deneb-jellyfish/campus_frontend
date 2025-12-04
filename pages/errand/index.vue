<template>
  <view class="page-container">
    <view class="nav-header">
      <text class="title">校友圈子</text>
    </view>
    
    <view class="content">
      <view class="placeholder-box">
        <text>🏃‍♂️ 跑腿接单大厅</text>
        <view class="sub-text">此处显示待接单列表</view>
      </view>
      
      <!-- 模拟列表内容 -->
      <view v-for="i in 5" :key="i" class="mock-card">
        跑腿任务 #{{i}}: 取快递送到C楼
      </view>
    </view>

    <!-- 底部导航 -->
    <TabBar current-tab="circle" />
  </view>
</template>

<script setup>
import TabBar from '@/components/TabBar.vue'
import { onShow } from '@dcloudio/uni-app'

onShow(() => {
  uni.hideTabBar() // 隐藏原生TabBar，显示我们自定义的
})
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background: #F5F5F5;
  padding-bottom: 160rpx; /* 为TabBar留出空间 */
}
.nav-header {
  background: #fff;
  padding: 40rpx 30rpx 20rpx;
  position: sticky;
  top: 0;
  z-index: 10;
}
.title {
  font-size: 36rpx;
  font-weight: bold;
}
.content {
  padding: 30rpx;
}
.mock-card {
  background: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
  border-radius: 16rpx;
}
</style>