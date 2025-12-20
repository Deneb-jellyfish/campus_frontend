<template>
  <view class="container">
    <view class="custom-header white-theme">
      <view class="status-bar"></view>
      <view class="nav-bar">
        <view class="back-btn" @click="goBack"><text class="back-arrow">←</text></view>
        <text class="page-title">我的收藏</text>
      </view>
    </view>

    <view class="list-wrapper">
      <view v-for="item in list" :key="item.id" class="post-card" @click="goToDetail(item)">
        <!-- 头部显示原作者 -->
        <view class="card-header">
          <view class="user-info">
            <image :src="item.author?.avatar || '../../static/default-avatar.png'" class="avatar-img" mode="aspectFill"/>
            <view class="meta">
              <text class="user-name">{{ item.author?.nickname || '未知用户' }}</text>
              <text class="post-time">收藏于 {{ formatDate(item.collectedAt) }}</text>
            </view>
          </view>
        </view>
        
        <view class="card-content">
          <text class="text-body">{{ item.content }}</text>
          <!-- 这里为了简化，收藏列表如果有图只显示一张大图作为封面，或者复用上面的 grid 逻辑 -->
          <image 
            v-if="item.images && item.images.length > 0" 
            :src="item.images[0]" 
            class="cover-img" 
            mode="aspectFill"
          />
        </view>
        
        <view class="card-footer">
          <view class="action-item"><text class="icon">👍</text> {{ item.stats.likes }}</view>
          <view class="action-item"><text class="icon">💬</text> {{ item.stats.comments }}</view>
        </view>
      </view>
      
      <view v-if="list.length === 0" class="empty">暂无收藏内容</view>
    </view>
  </view>
</template>

<script setup>
// 复用 my-posts 的大部分逻辑，只是字段不同
import { ref, onMounted } from 'vue'
import { userApi } from '@/api/user'

const list = ref([])
onMounted(async () => {
  try {
    const res = await userApi.getMyCollections()
    if (res.code === 200) list.value = res.data.list
  } catch (e) {}
})

const goBack = () => uni.navigateBack()
const goToDetail = (post) => uni.navigateTo({ url: `/pages/post/detail?id=${post.id}` })
const formatDate = (str) => { if(!str) return ''; const d = new Date(str); return `${d.getMonth()+1}-${d.getDate()}`; }
</script>

<style scoped>
/* 样式与 my-posts 基本一致，微调封面图样式 */
.container { min-height: 100vh; background: #F5F5F5; }
.custom-header { position: fixed; top: 0; width: 100%; z-index: 100; background: #fff; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05); }
.status-bar { height: var(--status-bar-height); }
.nav-bar { height: 88rpx; display: flex; align-items: center; padding: 0 30rpx; }
.back-arrow { font-size: 40rpx; font-weight: bold; padding: 10rpx; margin-left: -10rpx; }
.page-title { flex: 1; text-align: center; font-size: 34rpx; font-weight: bold; margin-right: 40rpx; }

.list-wrapper { padding: 30rpx; padding-top: calc(var(--status-bar-height) + 118rpx); }

.post-card { background: #fff; border-radius: 20rpx; padding: 30rpx; margin-bottom: 24rpx; box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.03); }
.card-header { display: flex; align-items: center; margin-bottom: 20rpx; }
.avatar-img { width: 70rpx; height: 70rpx; border-radius: 50%; margin-right: 20rpx; background: #eee; }
.user-name { font-size: 28rpx; font-weight: bold; color: #333; display: block; }
.post-time { font-size: 22rpx; color: #999; margin-top: 4rpx; display: block; }

.text-body { font-size: 30rpx; color: #333; line-height: 1.5; margin-bottom: 16rpx; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; overflow: hidden; }
.cover-img { width: 100%; height: 300rpx; border-radius: 12rpx; margin-bottom: 16rpx; background: #f5f5f5; }

.card-footer { display: flex; gap: 40rpx; color: #999; font-size: 24rpx; }
.empty { text-align: center; color: #ccc; margin-top: 100rpx; }
</style>