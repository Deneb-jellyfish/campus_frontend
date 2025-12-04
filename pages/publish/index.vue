<template>
  <view class="publish-page">
    <view class="close-btn" @click="goBack">×</view>
    
    <view class="title">你想发布什么？</view>
    
    <view class="options-container">
      <view class="option-card post" @click="handlePublish('post')">
        <view class="icon">📝</view>
        <text class="opt-title">发帖子</text>
        <text class="opt-desc">分享生活 / 二手闲置 / 吐槽</text>
      </view>
      
      <view class="option-card errand" @click="handlePublish('errand')">
        <view class="icon">🏃‍♂️</view>
        <text class="opt-title">发跑腿</text>
        <text class="opt-desc">求代拿 / 帮忙办事 / 悬赏</text>
      </view>
    </view>
  </view>
</template>

<script setup>
const goBack = () => {
  uni.navigateBack()
}

const handlePublish = (type) => {
  uni.showToast({
    title: `选择了: ${type === 'post' ? '帖子' : '跑腿'}`,
    icon: 'none'
  })
  // 这里跳转到具体的编辑表单页面
}
</script>

<style scoped>
.publish-page {
  height: 100vh;
  background: #ffffff;
  padding: 60rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}
.close-btn {
  position: absolute;
  top: 80rpx;
  right: 60rpx;
  font-size: 60rpx;
  color: #333;
}
.title {
  font-size: 48rpx;
  font-weight: bold;
  margin-bottom: 80rpx;
}
.options-container {
  display: flex;
  flex-direction: column;
  gap: 40rpx;
}
.option-card {
  padding: 40rpx;
  border-radius: 24rpx;
  display: flex;
  flex-direction: column;
  transition: all 0.2s;
}
.option-card:active {
  transform: scale(0.98);
}
.option-card.post { background: #E8F5E9; }
.option-card.errand { background: #E3F2FD; }

.icon { font-size: 60rpx; margin-bottom: 20rpx; }
.opt-title { font-size: 36rpx; font-weight: bold; margin-bottom: 10rpx; color: #333; }
.opt-desc { font-size: 26rpx; color: #666; }
</style>