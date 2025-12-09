<template>
  <view class="follow-page">
    <view 
      v-for="user in list" 
      :key="user.id" 
      class="user-item"
      @click="goToUserHome(user.id)"
    >
      <view class="avatar">👤</view>
      <view class="info">
        <text class="name">{{ user.nickname }}</text>
        <text class="bio">{{ user.bio }}</text>
      </view>
      <!-- 阻止冒泡，避免点击按钮时跳转页面 -->
      <view class="btn-box" @click.stop>
        <button 
          class="action-btn" 
          :class="{ outline: user.isFollowing }"
          @click="toggleFollow(user)"
        >
          {{ user.isFollowing ? '已关注' : '关注' }}
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { userApi } from '@/api/user'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const list = ref([])

onMounted(() => {
  loadData()
})

const loadData = async () => {
  try {
    const res = await userApi.getFollowList(userStore.userInfo.id)
    if (res.code === 200) {
      list.value = res.data.list
    }
  } catch (e) {
    console.error(e)
  }
}

const goToUserHome = (id) => {
  uni.navigateTo({ url: `/pages/user/home?id=${id}` })
}

const toggleFollow = async (user) => {
  const newStatus = !user.isFollowing
  try {
    await userApi.toggleFollow(user.id, newStatus)
    user.isFollowing = newStatus
    uni.showToast({ title: newStatus ? '关注成功' : '已取消', icon: 'none' })
  } catch (e) {
    uni.showToast({ title: '操作失败', icon: 'none' })
  }
}
</script>

<style scoped>
.follow-page { min-height: 100vh; background: #fff; }
.user-item { display: flex; align-items: center; padding: 30rpx; border-bottom: 1rpx solid #f5f5f5; }
.avatar { width: 90rpx; height: 90rpx; background: #eee; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin-right: 24rpx; font-size: 40rpx; }
.info { flex: 1; display: flex; flex-direction: column; }
.name { font-weight: bold; font-size: 32rpx; margin-bottom: 8rpx; }
.bio { color: #999; font-size: 26rpx; }
.action-btn { font-size: 24rpx; padding: 0 24rpx; height: 56rpx; line-height: 56rpx; border-radius: 28rpx; background: #52C41A; color: #fff; }
.action-btn.outline { background: #fff; color: #999; border: 1rpx solid #ddd; }
</style>