<template>
  <view class="page-container">
    <view class="profile-header">
      <!-- 签到按钮 (绝对定位在右上角) -->
      <view class="checkin-btn-wrapper" v-if="userStore.isLoggedIn">
        <button 
          class="checkin-btn" 
          :class="{ 'checked': isCheckedIn }"
          @click="handleCheckIn"
          :disabled="isCheckedIn"
        >
          {{ isCheckedIn ? '已签到' : '签到 +10' }}
        </button>
      </view>

      <!-- 用户卡片 (保持不变) -->
      <view class="user-card" @click="handleUserCardClick">
        <image 
          v-if="userStore.isLoggedIn && userStore.avatar"
          :src="userStore.avatar" 
          class="avatar-img"
          mode="aspectFill"
        />
        <view v-else class="avatar-placeholder">👤</view>
        
        <view class="info">
          <template v-if="userStore.isLoggedIn">
            <text class="username">{{ userStore.nickname }}</text>
            <text class="school">{{ userStore.userInfo.school || '未认证学校' }}</text>
            <text class="bio">{{ userStore.userInfo.bio || '这个人很懒...' }}</text>
          </template>
          <template v-else>
            <text class="username">未登录用户</text>
            <text class="desc">点击此处登录/注册</text>
          </template>
        </view>
      </view>

      <!-- 积分数据和关注/粉丝 (从 userInfo.stats 读取) -->
      <view class="stats" v-if="userStore.isLoggedIn">
        <view class="stat-item">
          <text class="num">{{ userStore.userInfo.points || 0 }}</text>
          <text class="label">我的积分</text>
        </view>
        <!-- 跳转到我的关注列表 -->
        <view class="stat-item" @click="goToFollowList('following')">
          <text class="num">{{ userStore.userInfo.stats?.following || 0 }}</text>
          <text class="label">关注</text>
        </view>
        <!-- 跳转到我的粉丝列表 -->
        <view class="stat-item" @click="goToFollowList('followers')">
          <text class="num">{{ userStore.userInfo.stats?.followers || 0 }}</text>
          <text class="label">粉丝</text>
        </view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-list">
      <view class="menu-item" @click="handleMyPosts">
        <text>📝 我的发布</text>
        <text class="arrow">></text>
      </view>

      <view class="menu-item" @click="handleMyErrands">
        <text>🏃‍♂️ 我的跑腿</text>
        <text class="arrow">></text>
      </view>
      
      <view class="menu-item" @click="handleMyCollections">
        <text>⭐ 我的收藏</text>
        <text class="arrow">></text>
      </view>
     
      <view class="menu-item" @click="handleSettings">
        <text>⚙️ 个人资料设置</text>
        <text class="arrow">></text>
      </view>

     <!-- 管理员入口 (仅演示用，实际需判断权限) -->
     <!-- 只有当用户角色是 ADMIN 时才显示此按钮 -->
	 <view class="menu-item admin-entry" @click="handleAdmin" v-if="userStore.userInfo.role === 'ADMIN'">
	   <text>🛡️ 内容审核后台</text>
	   <text class="arrow">></text>
	 </view>
      
      <!-- 退出登录按钮 (U05) -->
      <view 
        v-if="userStore.isLoggedIn" 
        class="menu-item logout"
        @click="handleLogout"
      >
        <text>退出登录</text>
      </view>
    </view>
	
	
    <!-- 简易展示我的帖子 (联调测试用) -->
    <view v-if="userStore.isLoggedIn && myPosts.length > 0" class="recent-posts">
      <view class="section-title">最近发布</view>
      <view v-for="post in myPosts" :key="post.id" class="mini-post">
        <text class="post-content">{{ post.content }}</text>
        <text class="post-date">浏览 {{ post.stats.views }}</text>
      </view>
    </view>

    <TabBar current-tab="profile" />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import TabBar from '@/components/TabBar.vue'
import { useUserStore } from '@/stores/user'
import { userApi } from '@/api/user'

const userStore = useUserStore()
const myPosts = ref([])
const isCheckedIn = ref(false) // 签到状态

onShow(() => {
  uni.hideTabBar()
  // 每次显示页面，如果已登录，刷新一下用户信息（确保积分最新）
  if (userStore.isLoggedIn) {
    refreshData()
  }
})

const refreshData = async () => {
  try {
    // 1. 并行获取用户信息和签到状态
    const [userRes, checkInRes, postRes] = await Promise.all([
      userApi.getUserInfo(), // U03 获取当前用户信息
      userApi.getCheckInStatus(), // U04 获取今日签到状态
      userApi.getMyPosts() // U05 获取我的帖子列表
    ])

    if (userRes.code === 200) {
        userStore.updateUserInfo(userRes.data);
        // 如果后端在 getUserInfo 中返回了 role，可以在这里更新
        // if (userRes.data.role) {
        //   userStore.updateUserRole(userRes.data.role);
        // }
    }
    if (checkInRes.code === 200) isCheckedIn.value = checkInRes.data.checkedIn
    if (postRes.code === 200) myPosts.value = postRes.data.list
    
  } catch (e) {
    console.error('刷新数据失败', e)
    uni.showToast({ title: '刷新数据失败', icon: 'none' })
  }
}

// 签到逻辑
const handleCheckIn = async () => {
  if (isCheckedIn.value) return
  
  try {
    uni.showLoading({ title: '签到中...' })
    const res = await userApi.checkIn() // U04 每日签到
    
    if (res.code === 200) {
      uni.showToast({ title: res.message, icon: 'success' })
      isCheckedIn.value = true
      
      // 更新 Store 中的积分
      userStore.updateUserInfo({
        points: res.data.totalPoints
      })
    } else {
        throw new Error(res.message || '签到失败');
    }
  } catch (error) {
    uni.showToast({ title: error.message || '签到失败', icon: 'none' })
  } finally {
    uni.hideLoading()
  }
}


// 1. 点击用户卡片 -> 编辑资料
const handleUserCardClick = () => {
  if (!userStore.isLoggedIn) {
    uni.navigateTo({ url: '/pages/login/index' })
  } else {
    // 跳转到编辑页
    uni.navigateTo({ url: '/pages/profile/edit' })
  }
}

// 2. 点击设置 -> 编辑资料 (或者单独的设置页，这里先复用)
const handleSettings = () => {
  if (!userStore.isLoggedIn) return uni.navigateTo({ url: '/pages/login/index' })
  uni.navigateTo({ url: '/pages/profile/edit' })
}

// 3. 点击我的跑腿
const handleMyErrands = () => {
  if (!userStore.isLoggedIn) return uni.navigateTo({ url: '/pages/login/index' })
  // 跳转到我的跑腿页面，该页面需要自己实现逻辑调用 /users/me/errands 接口
  uni.navigateTo({ url: '/pages/profile/my-errands' })
}

// 4. 点击内容审核后台
const handleAdmin = () => {
  // TODO: 后续完善用户角色判断
  // if (userStore.userInfo.role !== 'ADMIN') {
  //   return uni.showToast({title:'无权限访问', icon:'none'});
  // }
  uni.navigateTo({ url: '/pages/admin/report-list' })
}

// 5. 退出登录
const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: async (res) => { // 添加 async
      if (res.confirm) {
        await userStore.logout() // 等待退出操作完成
        myPosts.value = [] // 清空本地数据
        uni.showToast({ title: '已退出', icon: 'none' })
      }
    }
  })
}

// 新增跳转逻辑：我的发布
const handleMyPosts = () => {
  if (!userStore.isLoggedIn) return uni.navigateTo({ url: '/pages/login/index' })
  uni.navigateTo({ url: '/pages/profile/my-posts' }) // 导航到 my-posts 页面
}

// 新增跳转逻辑：我的收藏
const handleMyCollections = () => {
  if (!userStore.isLoggedIn) return uni.navigateTo({ url: '/pages/login/index' })
  uni.navigateTo({ url: '/pages/profile/my-collections' }) // 导航到 my-collections 页面
}

// 统一处理关注/粉丝列表跳转
const goToFollowList = (type) => {
  if (!userStore.isLoggedIn) return uni.navigateTo({ url: '/pages/login/index' })
  uni.navigateTo({ url: `/pages/profile/follow-list?type=${type}` }) // 导航到 follow-list 页面
}
</script>

<style scoped>
/* 保持原有样式 */
.page-container {
  min-height: 100vh;
  background: #F5F5F5;
  padding-bottom: 160rpx;
}

.profile-header {
  background: #fff;
  padding: 100rpx 40rpx 40rpx;
  margin-bottom: 20rpx;
  position: relative; /* 为签到按钮定位 */
}

.user-card {
  display: flex;
  align-items: center;
  margin-bottom: 50rpx;
}

.avatar-img {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  margin-right: 30rpx;
  border: 4rpx solid #fff;
  box-shadow: 0 4rpx 10rpx rgba(0,0,0,0.1);
}

.avatar-placeholder {
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

.info { display: flex; flex-direction: column; flex: 1; }
.username { font-size: 40rpx; font-weight: bold; margin-bottom: 10rpx; color: #333; }
.school { font-size: 24rpx; color: #52C41A; background: #F6FFED; padding: 2rpx 10rpx; border-radius: 8rpx; align-self: flex-start; margin-bottom: 8rpx; border: 1rpx solid #B7EB8F; }
.bio { font-size: 26rpx; color: #999; }
.desc { color: #999; font-size: 28rpx; }

.stats { 
  display: flex; 
  justify-content: space-around; 
  padding-top: 20rpx;
  border-top: 1rpx solid #f5f5f5;
}
.stat-item { display: flex; flex-direction: column; align-items: center; }
.num { font-weight: bold; font-size: 36rpx; margin-bottom: 6rpx; color: #333; }
.label { font-size: 24rpx; color: #999; }

.menu-list { background: #fff; margin-bottom: 20rpx; }
.menu-item {
  padding: 34rpx 40rpx;
  border-bottom: 1rpx solid #f5f5f5;
  font-size: 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.menu-item:active { background-color: #fafafa; }
.arrow { color: #ccc; font-family: monospace; }
.logout { color: #ff4d4f; justify-content: center; font-weight: bold; margin-top: 20rpx; }

.recent-posts {
  background: #fff;
  padding: 30rpx 40rpx;
  margin-top: 20rpx; /* 与上一个模块保持距离 */
}
.section-title { font-weight: bold; margin-bottom: 20rpx; font-size: 30rpx; }
.mini-post {
  padding: 20rpx 0;
  border-bottom: 1rpx solid #eee;
}
.post-content { font-size: 28rpx; color: #333; margin-bottom: 10rpx; display: block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.post-date { font-size: 22rpx; color: #999; }


/* 新增签到按钮样式 */
.checkin-btn-wrapper {
  position: absolute;
  top: 40rpx;
  right: 40rpx;
  z-index: 10; /* 确保在最上层 */
}
.checkin-btn {
  background: linear-gradient(135deg, #FF7E5F 0%, #FEB47B 100%);
  color: #fff;
  font-size: 24rpx;
  padding: 0 30rpx;
  height: 60rpx;
  line-height: 60rpx;
  border-radius: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(254, 180, 123, 0.4);
  border: none;
}
.checkin-btn.checked {
  background: #f0f0f0;
  color: #999;
  box-shadow: none;
}
.checkin-btn::after { border: none; }
</style>