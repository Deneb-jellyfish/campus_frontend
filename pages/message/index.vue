<template>
  <view class="page-container">
    <view class="nav-header">
      <text class="title">消息</text>
    </view>
    
    <view class="msg-list">
      <!-- 模拟消息列表 -->
      <view 
        v-for="item in mockChats" 
        :key="item.id" 
        class="msg-item"
        @click="goToChat(item)"
      >
        <view class="avatar">{{ item.avatar }}</view>
        <view class="msg-info">
          <view class="top">
            <text class="name">{{ item.name }}</text>
            <text class="time">{{ item.time }}</text>
          </view>
          <text class="last-msg">{{ item.msg }}</text>
        </view>
      </view>
    </view>

    <TabBar current-tab="message" />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import TabBar from '@/components/TabBar.vue'
import { onShow } from '@dcloudio/uni-app'

onShow(() => {
  uni.hideTabBar()
})

const mockChats = ref([
  { id: 101, name: '黄灯泡绿灯炮', avatar: '👨', time: '10:20', msg: '那个笔记本还在吗？' },
  { id: 102, name: '学习小达人', avatar: '👦', time: '昨天', msg: '谢谢同学！' },
])

const goToChat = (user) => {
  // 跳转到你原本的 chat 页面
  uni.navigateTo({
    url: `/pages/chat/chat?userId=${user.id}`
  })
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background: #fff;
  padding-bottom: 160rpx;
}
.nav-header {
  padding: 80rpx 30rpx 20rpx;
  background: #F8F8F8;
}
.title {
  font-size: 40rpx;
  font-weight: 800;
}
.msg-item {
  display: flex;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}
.avatar {
  width: 100rpx;
  height: 100rpx;
  background: #eee;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 50rpx;
  margin-right: 24rpx;
}
.msg-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8rpx;
}
.name { font-weight: bold; font-size: 32rpx; }
.time { font-size: 24rpx; color: #999; }
.last-msg { font-size: 28rpx; color: #666; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 500rpx;}
</style>