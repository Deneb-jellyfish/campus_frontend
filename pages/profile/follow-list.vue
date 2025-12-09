<template>
  <view class="follow-page">
    <!-- 自定义头部 (粉色) -->
    <view class="custom-header pink-theme">
      <view class="status-bar"></view>
      <view class="nav-bar">
        <!-- 返回按钮 -->
        <view class="back-btn" @click="goBack">
          <text class="back-arrow">←</text>
        </view>
        <text class="page-title">{{ type === 'followers' ? '我的粉丝' : '我的关注' }}</text>
      </view>
    </view>

    <!-- 列表容器 -->
    <view class="list-container">
      <view v-for="user in list" :key="user.id" class="user-item" @click="goToUserHome(user.id)">
        <view class="avatar">👤</view>
        <view class="info">
          <text class="name">{{ user.nickname }}</text>
          <text class="bio">{{ user.bio }}</text>
        </view>
        <view class="btn-box" @click.stop>
          <button class="action-btn" :class="{ outline: user.isFollowing }" @click="toggleFollow(user)">
            {{ getBtnText(user) }}
          </button>
        </view>
      </view>
      
      <view v-if="list.length === 0" class="empty">暂无数据</view>
    </view>
  </view>

</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { userApi } from '@/api/user'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const list = ref([])
const type = ref('following') // following | followers

onLoad((options) => {
  if (options.type) {
    type.value = options.type
  }
  loadData()
})
// 新增：返回功能
const goBack = () => uni.navigateBack()
const loadData = async () => {
  try {
    let res
    if (type.value === 'followers') {
      res = await userApi.getFollowers(userStore.userInfo.id)
    } else {
      res = await userApi.getFollowList(userStore.userInfo.id)
    }
    
    if (res.code === 200) {
      list.value = res.data.list
    }
  } catch (e) { console.error(e) }
}

const goToUserHome = (id) => {
  uni.navigateTo({ url: `/pages/user/home?id=${id}` })
}

const getBtnText = (user) => {
  if (user.isFollowing) {
    return type.value === 'followers' ? '互相关注' : '已关注'
  }
  return type.value === 'followers' ? '回粉' : '关注'
}

const toggleFollow = async (user) => {
  const newStatus = !user.isFollowing
  try {
    await userApi.toggleFollow(user.id, newStatus)
    user.isFollowing = newStatus
    
    // 如果是关注列表，取关后理论上应该移除该条目，或者刷新列表
    if (type.value === 'following' && !newStatus) {
      // 简单处理：更新状态即可，不强制移除，防止误触
    }
    uni.showToast({ title: '操作成功', icon: 'none' })
  } catch (e) {
    uni.showToast({ title: '操作失败', icon: 'none' })
  }
}

</script>

<style scoped>
.follow-page { min-height: 100vh; background: #fff; }

/* 头部样式复用逻辑 */
.custom-header { width: 100%; position: fixed; top: 0; z-index: 100; }
.status-bar { height: var(--status-bar-height); width: 100%; }

.pink-theme {
  background: linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%); /* 粉色渐变 */
  box-shadow: 0 4rpx 10rpx rgba(255, 154, 158, 0.2);
}

.nav-bar {
  height: 80rpx;
  display: flex;
  align-items: center;
  position: relative;
  padding: 0 30rpx;
}
.back-btn {
  position: absolute;
  left: 30rpx;
  padding: 10rpx;
  z-index: 101;
}
.back-arrow { font-size: 40rpx; color: #333; font-weight: bold; }
.page-title { flex: 1; text-align: center; font-size: 34rpx; font-weight: bold; color: #333; }

/* 列表下移 */
.list-container {
  padding-top: calc(var(--status-bar-height) + 88rpx);
}

/* 原有列表样式优化 */
.user-item { display: flex; align-items: center; padding: 30rpx; border-bottom: 1rpx solid #f5f5f5; }
.avatar { width: 90rpx; height: 90rpx; background: #eee; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin-right: 24rpx; font-size: 40rpx; border: 2rpx solid #fff; box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1); }
.info { flex: 1; display: flex; flex-direction: column; }
.name { font-weight: bold; font-size: 32rpx; margin-bottom: 8rpx; color: #333; }
.bio { color: #999; font-size: 26rpx; }
.action-btn { font-size: 24rpx; padding: 0 24rpx; height: 56rpx; line-height: 56rpx; border-radius: 28rpx; background: #FF758C; color: #fff; min-width: 120rpx; border: none; }
.action-btn.outline { background: #fff; color: #999; border: 1rpx solid #ddd; }
.empty { text-align: center; color: #999; margin-top: 100rpx; }
</style>
