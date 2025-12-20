<template>
  <view class="user-home" v-if="userInfo">
    <!-- 1. 头部背景 -->
    <view class="header-bg"></view>
    
    <!-- 2. 个人信息卡片 -->
    <view class="profile-card">
      <view class="top-row">
        <!-- 头像 -->
        <view class="avatar-wrapper">
           <image 
             v-if="userInfo.avatarUrl" 
             :src="getFullImageUrl(userInfo.avatarUrl)" 
             class="avatar" 
             mode="aspectFill"
           ></image>
           <view v-else class="avatar avatar-placeholder">👤</view>
        </view>

        <!-- 按钮区域：如果是自己显示编辑，如果是别人显示关注 -->
        <view class="action-box">
          <button v-if="isSelf" class="edit-btn" @click="goToEdit">编辑资料</button>
          <button 
            v-else
            class="follow-btn" 
            :class="{ active: userInfo.isFollowing }" 
            @click="handleFollow"
          >
            {{ userInfo.isFollowing ? '已关注' : '+ 关注' }}
          </button>
        </view>
      </view>
      
      <!-- 文字信息 -->
      <view class="info-block">
        <view class="name">{{ userInfo.nickname || userInfo.username }}</view>
        <view class="school">{{ userInfo.school || '未认证学校' }}</view>
        <view class="bio">{{ userInfo.bio || '这个人很懒，什么都没写~' }}</view>
      </view>
      
      <!-- 数据统计 (粉丝/关注/获赞) -->
      <view class="stats-row">
        <view class="stat" @click="goToFollowList('followers')">
          <text class="num">{{ userInfo.stats?.followers || 0 }}</text>
          <text class="label">粉丝</text>
        </view>
        <view class="stat" @click="goToFollowList('following')">
          <text class="num">{{ userInfo.stats?.following || 0 }}</text>
          <text class="label">关注</text>
        </view>
        <view class="stat">
          <text class="num">{{ userInfo.stats?.likes || 0 }}</text>
          <text class="label">获赞</text>
        </view>
      </view>
    </view>
    
    <!-- 3. 动态帖子列表 (核心修复部分) -->
    <view class="posts-section">
      <view class="section-title">
        {{ isSelf ? '我的动态' : 'Ta的动态' }}
      </view>
      
      <!-- ✅ 帖子列表渲染 -->
      <view v-if="postsList.length > 0" class="post-list">
        <view v-for="item in postsList" :key="item.id" class="post-item">
          
          <!-- 帖子文本内容 -->
          <text class="post-content">{{ item.content }}</text>
          
          <!-- 帖子图片 (假设 item.images 是数组) -->
          <view v-if="item.images && item.images.length" class="post-imgs">
            <image 
              v-for="(img, idx) in item.images" 
              :key="idx"
              :src="getFullImageUrl(img)"
              class="post-img"
              mode="aspectFill"
              @click.stop="previewImage(item.images, idx)"
            />
          </view>
          
          <!-- 底部时间与点赞 -->
          <view class="post-footer">
            <text class="time">{{ formatTime(item.createTime) }}</text>
            <view class="likes">❤️ {{ item.stats?.likes || 0 }}</view>
          </view>
        </view>
      </view>
      
      <!-- 空状态 -->
      <view v-else class="empty-tip">暂无公开动态</view>
    </view>
  </view>
  
  <!-- 加载中状态 -->
  <view v-else class="loading-state">
    <text>加载中...</text>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { userApi } from '@/api/user'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// ⚠️ 注意：手机调试请修改为电脑局域网 IP
const BASE_URL = 'http://localhost:8080' 

const userInfo = ref(null)
const postsList = ref([]) // 存储帖子列表
const targetId = ref('')  // 当前查看的目标ID

// 判断是否是自己
const isSelf = computed(() => {
  return userStore.userInfo && String(userStore.userInfo.id) === String(targetId.value)
})

onLoad((options) => {
  // 1. 确定要看谁的主页
  if (options.id) {
    // URL 带 ID，说明是看别人 (或者是通过链接看自己)
    targetId.value = options.id
  } else {
    // URL 没带 ID，说明是点 TabBar 进来的，看自己
    if (userStore.userInfo) {
      targetId.value = userStore.userInfo.id
    } else {
      // 没登录就去登录
      uni.navigateTo({ url: '/pages/login/index' })
      return
    }
  }
  
  // 2. 发起请求
  loadData()
})

// 核心加载逻辑
const loadData = async () => {
  if (!targetId.value) return

  try {
    uni.showLoading({ title: '加载中' })
    
    // 🔥 并行请求：同时获取 用户详情 和 帖子列表
    // 这里的 userApi.getUserPosts 必须在 api/user.js 中定义好
    const [profileRes, postsRes] = await Promise.all([
      userApi.getUserProfile(targetId.value),
      userApi.getUserPosts(targetId.value) 
    ])
    
    // 1. 处理个人资料
    if (profileRes.code === 200) {
      userInfo.value = profileRes.data
    }
    
    // 2. 处理帖子列表
    if (postsRes && postsRes.code === 200) {
      // 确保取到的是 list 数组
      postsList.value = postsRes.data.list || []
      console.log('加载到的帖子数量:', postsList.value.length)
    }
    
  } catch (e) {
    console.error('加载主页失败:', e)
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    uni.hideLoading()
  }
}

// 关注逻辑
const handleFollow = async () => {
  if (!userStore.isLoggedIn) return uni.navigateTo({ url: '/pages/login/index' })
  if (userInfo.value.loading) return
  
  userInfo.value.loading = true
  const isFollowing = userInfo.value.isFollowing
  
  try {
    await userApi.toggleFollow(targetId.value, !isFollowing)
    
    // 更新视图
    userInfo.value.isFollowing = !isFollowing
    if (!userInfo.value.stats) userInfo.value.stats = { followers: 0 }
    
    if (userInfo.value.isFollowing) {
      userInfo.value.stats.followers++
      uni.showToast({ title: '关注成功', icon: 'none' })
    } else {
      userInfo.value.stats.followers = Math.max(0, userInfo.value.stats.followers - 1)
      uni.showToast({ title: '已取消', icon: 'none' })
    }
  } catch (e) {
    uni.showToast({ title: '操作失败', icon: 'none' })
  } finally {
    userInfo.value.loading = false
  }
}

// 图片地址处理
const getFullImageUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${BASE_URL}${url.startsWith('/') ? url : '/' + url}`
}

// 图片预览
const previewImage = (images, current) => {
  const urls = images.map(img => getFullImageUrl(img))
  uni.previewImage({
    urls,
    current
  })
}

// 简单时间格式化
const formatTime = (timeStr) => {
  if (!timeStr) return ''
  // 将 "2025-12-20T12:00:00" 转为 "2025-12-20 12:00"
  return timeStr.replace('T', ' ').substring(0, 16)
}

// 跳转逻辑
const goToFollowList = (type) => {
  uni.navigateTo({
    url: `/pages/profile/follow-list?type=${type}&userId=${targetId.value}`
  })
}

const goToEdit = () => {
  uni.navigateTo({ url: '/pages/user/settings/profile' })
}
</script>

<style scoped>
.user-home { min-height: 100vh; background: #F5F5F5; padding-bottom: 40rpx; }
.loading-state { display: flex; justify-content: center; padding-top: 100rpx; color: #999; }

/* 头部背景 */
.header-bg { height: 200rpx; background: linear-gradient(135deg, #a8e6cf 0%, #dcedc1 100%); }

/* 个人资料卡片 */
.profile-card { background: #fff; margin: -100rpx 30rpx 30rpx; border-radius: 20rpx; padding: 30rpx; box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05); position: relative; }

.top-row { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 20rpx; height: 80rpx; }
.avatar-wrapper { transform: translateY(-40rpx); margin-bottom: -40rpx; }
.avatar { width: 140rpx; height: 140rpx; border-radius: 50%; border: 4rpx solid #fff; background: #fff; }
.avatar-placeholder { width: 140rpx; height: 140rpx; border-radius: 50%; background: #eee; display: flex; justify-content: center; align-items: center; font-size: 60rpx; border: 4rpx solid #fff; color: #999;}

.follow-btn { margin: 0; font-size: 26rpx; background: #52C41A; color: #fff; border-radius: 30rpx; padding: 0 34rpx; height: 60rpx; line-height: 60rpx; border: none;}
.follow-btn.active { background: #f0f0f0; color: #999; border: 1rpx solid #eee; }
.edit-btn { margin: 0; font-size: 26rpx; background: #fff; color: #666; border: 1rpx solid #ddd; border-radius: 30rpx; padding: 0 34rpx; height: 60rpx; line-height: 60rpx; }

.info-block { margin-bottom: 30rpx; margin-top: 10rpx; }
.name { font-size: 40rpx; font-weight: bold; margin-bottom: 8rpx; color: #333; }
.school { font-size: 22rpx; color: #52C41A; background: #F6FFED; display: inline-block; padding: 4rpx 12rpx; border-radius: 8rpx; margin-bottom: 16rpx; border: 1rpx solid #B7EB8F; }
.bio { font-size: 28rpx; color: #666; line-height: 1.4; }

.stats-row { display: flex; justify-content: space-around; border-top: 1rpx solid #f5f5f5; padding-top: 20rpx; }
.stat { display: flex; flex-direction: column; align-items: center; }
.num { font-weight: bold; font-size: 32rpx; color: #333; }
.label { font-size: 24rpx; color: #999; }

/* 动态列表样式 */
.posts-section { margin: 0 30rpx; background: #fff; border-radius: 20rpx; padding: 30rpx; min-height: 300rpx; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.02); }
.section-title { font-weight: bold; margin-bottom: 20rpx; font-size: 30rpx; border-left: 8rpx solid #52C41A; padding-left: 20rpx; }
.empty-tip { text-align: center; color: #ccc; margin-top: 80rpx; font-size: 28rpx; }

.post-item { padding: 30rpx 0; border-bottom: 1rpx solid #f9f9f9; }
.post-item:last-child { border-bottom: none; }
.post-content { font-size: 30rpx; color: #333; line-height: 1.5; margin-bottom: 16rpx; display: block; }
.post-imgs { display: flex; flex-wrap: wrap; gap: 10rpx; margin-bottom: 16rpx; }
.post-img { width: 190rpx; height: 190rpx; border-radius: 8rpx; background: #eee; }
.post-footer { display: flex; justify-content: space-between; align-items: center; color: #999; font-size: 24rpx; }
</style>