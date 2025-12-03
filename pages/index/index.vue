<template>
  <view class="home-page">
    <!-- 顶部导航 -->
    <view class="header">
      <view class="school-info">
        <view class="avatar">🎓</view>
        <view class="school-name">
          <text class="name">码住校园圈</text>
          <text class="sub-name">浙江大学城市学院</text>
        </view>
      </view>
      <view class="header-actions">
        <text class="icon">⋮</text>
        <text class="icon">⊙</text>
      </view>
    </view>

    <!-- 搜索栏 -->
    <view class="search-bar" @click="goToSearch">
      <text class="search-icon">🔍</text>
      <text class="search-text">点我查找内容</text>
    </view>

    <!-- 热门话题卡片 -->
    <view class="hot-topics-card">
      <view class="card-header">
        <text class="card-title">🔥 热门话题</text>
        <text class="more-btn">查看更多 ›</text>
      </view>
      <view class="topics-container">
        <view class="topic-item" v-for="topic in topics" :key="topic.id" @click="goToTopic(topic.id)">
          <view class="topic-content">
            <text class="topic-tag">#</text>
            <text class="topic-title">{{ topic.title }}</text>
            <text class="topic-icon">{{ topic.hot ? '🔥' : '' }}</text>
          </view>
          <view class="topic-meta">
            <text class="topic-views">累计{{ topic.views }}人气</text>
            <view class="topic-avatars">
              <text v-for="(avatar, index) in topic.participants" :key="index" class="avatar-small">
                {{ avatar }}
              </text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 内容分类导航 - 占位 -->
    <view class="category-nav-placeholder" v-if="isNavFixed"></view>
    
    <!-- 内容分类导航 - 吸顶 + 磨砂效果 -->
    <view class="category-nav-wrapper" :class="{ 'is-fixed': isNavFixed }">
      <scroll-view class="category-nav" scroll-x show-scrollbar="false">
        <view 
          v-for="(item, index) in categories" 
          :key="index"
          class="category-item"
          :class="{ active: currentCategory === item.id }"
          @click="switchCategory(item.id)"
        >
          {{ item.name }}
        </view>
      </scroll-view>
    </view>

    <!-- 帖子列表 -->
    <view class="post-list">
      <view class="post-card" v-for="post in posts" :key="post.id">
        <!-- 帖子头部 -->
        <view class="post-header">
          <view class="user-info">
            <view class="user-avatar">{{ post.userAvatar }}</view>
            <view class="user-detail">
              <view class="user-name-row">
                <text class="user-name">{{ post.userName }}</text>
                <text class="user-level">{{ post.userLevel }}</text>
              </view>
              <text class="post-time">{{ post.time }}</text>
            </view>
          </view>
          <text class="post-more">⋮</text>
        </view>

        <!-- 帖子内容 -->
        <view class="post-content">
          <view class="post-tag" v-if="post.tag">
            <text>{{ post.tag }}</text>
          </view>
          <text class="post-text">{{ post.content }}</text>
        </view>

        <!-- 帖子图片 -->
        <view class="post-images" v-if="post.images && post.images.length > 0">
          <view 
            class="image-item" 
            v-for="(img, index) in post.images" 
            :key="index"
            :style="{ backgroundColor: img }"
          >
          </view>
        </view>

        <!-- 商品信息 -->
        <view class="product-info" v-if="post.product">
          <text class="product-tag">🛒 在售</text>
          <text class="product-price">价格: ¥{{ post.product.price }}</text>
        </view>

        <!-- 帖子底部互动 -->
        <view class="post-footer">
          <view class="footer-item">
            <text class="icon">👁</text>
            <text>{{ post.views }}</text>
          </view>
          <view class="footer-item">
            <text class="icon">💬</text>
            <text>{{ post.comments }}</text>
          </view>
          <view class="footer-item">
            <text class="icon">👍</text>
            <text>{{ post.likes }}</text>
          </view>
          <view class="footer-item">
            <text class="icon">💬</text>
            <text>评论</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部占位，防止被tabbar遮挡 -->
    <view class="bottom-space"></view>

    <!-- 底部导航栏 - 悬浮样式 -->
    <view class="tabbar-container">
      <view class="tabbar">
        <view 
          class="tabbar-item" 
          v-for="(item, index) in tabbarList" 
          :key="index"
          :class="{ active: currentTab === item.id, 'publish-btn': item.id === 'publish' }"
          @click="switchTab(item.id)"
        >
          <view v-if="item.id === 'publish'" class="publish-circle">
            <text class="tabbar-icon">{{ item.icon }}</text>
          </view>
          <template v-else>
            <text class="tabbar-icon">{{ item.icon }}</text>
            <text class="tabbar-label">{{ item.label }}</text>
          </template>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentTab: 'home',
      currentCategory: 0,
      isNavFixed: false,
      // 底部导航数据
      tabbarList: [
        { id: 'home', label: '首页', icon: '🏠' },
        { id: 'circle', label: '跑腿', icon: '👥' },
        { id: 'publish', label: '', icon: '➕' },
        { id: 'message', label: '消息', icon: '💬' },
        { id: 'profile', label: '我的', icon: '👤' }
      ],
      // 话题数据
      topics: [
        { 
          id: 1, 
          title: '在家也能做你喜欢的事情', 
          hot: true, 
          views: '123万',
          participants: ['👤', '👤', '👤', '👤']
        },
        { 
          id: 2, 
          title: '旅行的意义是什么', 
          hot: true, 
          views: '97万',
          participants: ['👤', '👤', '👤', '👤']
        },
        { 
          id: 3, 
          title: '今天的单子有点多啊', 
          hot: false, 
          views: '65万',
          participants: ['👤', '👤', '👤', '👤']
        }
      ],
      // 分类导航
      categories: [
        { id: 0, name: '全部' },
        { id: 1, name: '闲置' },
        { id: 2, name: '求助' },
        { id: 3, name: '日常生活' },
        { id: 4, name: '投票' },
        { id: 5, name: '吐槽' }
      ],
      // 帖子数据
      posts: [
        {
          id: 1,
          userAvatar: '👨',
          userName: '黄灯泡绿灯炮',
          userLevel: 'LV.3',
          time: '2024晚',
          tag: '闲置',
          content: '出一台笔记本自用的可以流畅打朝瓦打cf,换台式了所以不用了,爽快来,980买不了...',
          images: ['#8B7355', '#6B5344', '#5C4033'],
          product: { price: 980 },
          views: '14206',
          comments: '124',
          likes: '234'
        },
        {
          id: 2,
          userAvatar: '👨',
          userName: '黄灯泡绿灯炮',
          userLevel: 'LV.3',
          time: '2024晚',
          tag: '投票',
          content: '下雨天你最喜欢干什么?',
          images: [],
          views: '14206',
          comments: '124',
          likes: '234'
        },
        {
          id: 3,
          userAvatar: '👩',
          userName: '小红的日常',
          userLevel: 'LV.5',
          time: '1小时前',
          tag: '日常生活',
          content: '今天天气真好，分享一下校园里的美景～阳光洒在草坪上，感觉整个人都充满了活力！',
          images: ['#90EE90', '#98FB98', '#87CEEB'],
          views: '8520',
          comments: '56',
          likes: '892'
        },
        {
          id: 4,
          userAvatar: '👦',
          userName: '学习小达人',
          userLevel: 'LV.4',
          time: '3小时前',
          tag: '求助',
          content: '有没有人知道图书馆几点开门啊？明天要去占座准备期末考试',
          images: [],
          views: '3240',
          comments: '45',
          likes: '120'
        }
      ]
    };
  },
  onPageScroll(e) {
    // 监听页面滚动，判断分类导航是否需要吸顶
    // 当滚动超过顶部导航+搜索栏+话题卡片的高度时触发
    this.isNavFixed = e.scrollTop > 400;
  },
  methods: {
    goToSearch() {
      console.log('跳转到搜索页面');
    },
    goToTopic(id) {
      console.log('跳转到话题详情:', id);
    },
    switchCategory(id) {
      this.currentCategory = id;
      console.log('切换分类:', id);
    },
    switchTab(tabId) {
      if (tabId === 'publish') {
        console.log('打开发布页面');
      } else {
        this.currentTab = tabId;
        console.log('切换Tab:', tabId);
      }
    }
  }
};
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 150rpx;
}

/* 顶部导航 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);
}

.school-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background-color: #c8e6c9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  margin-right: 20rpx;
}

.school-name {
  display: flex;
  flex-direction: column;
}

.name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.sub-name {
  font-size: 24rpx;
  color: #666;
  margin-top: 4rpx;
}

.header-actions {
  display: flex;
  gap: 30rpx;
}

.icon {
  font-size: 40rpx;
  color: #333;
}

/* 搜索栏 */
.search-bar {
  margin: 20rpx 30rpx;
  padding: 20rpx 30rpx;
  background-color: #fff;
  border-radius: 50rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.search-icon {
  margin-right: 15rpx;
  font-size: 32rpx;
}

.search-text {
  color: #999;
  font-size: 28rpx;
}

/* 热门话题卡片 */
.hot-topics-card {
  margin: 20rpx 30rpx;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25rpx;
  padding-bottom: 20rpx;
  border-bottom: 2rpx solid #f0f0f0;
}

.card-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.more-btn {
  font-size: 26rpx;
  color: #999;
}

.topics-container {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.topic-item {
  padding: 20rpx;
  background-color: #fafafa;
  border-radius: 15rpx;
  transition: all 0.3s;
}

.topic-item:active {
  background-color: #f0f0f0;
}

.topic-content {
  display: flex;
  align-items: center;
  margin-bottom: 15rpx;
}

.topic-tag {
  color: #8bc34a;
  font-size: 32rpx;
  font-weight: bold;
  margin-right: 10rpx;
}

.topic-title {
  font-size: 28rpx;
  color: #333;
  flex: 1;
}

.topic-icon {
  font-size: 30rpx;
}

.topic-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.topic-views {
  font-size: 24rpx;
  color: #999;
}

.topic-avatars {
  display: flex;
  gap: 10rpx;
}

.avatar-small {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20rpx;
}

/* 分类导航占位元素 */
.category-nav-placeholder {
  height: 88rpx;
}

/* 分类导航 - 吸顶 + 磨砂效果 */
.category-nav-wrapper {
  background-color: #fff;
  border-bottom: 1rpx solid #f0f0f0;
  transition: all 0.3s ease;
  z-index: 99;
}

.category-nav-wrapper.is-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(20rpx);
  -webkit-backdrop-filter: blur(20rpx);
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.08);
}

.category-nav {
  padding: 20rpx 30rpx;
  white-space: nowrap;
}

.category-item {
  display: inline-block;
  padding: 10rpx 25rpx;
  margin-right: 20rpx;
  font-size: 28rpx;
  color: #666;
  border-radius: 30rpx;
  transition: all 0.3s;
}

.category-item.active {
  background-color: #e8f5e9;
  color: #4caf50;
  font-weight: bold;
}

/* 帖子列表 */
.post-list {
  padding: 20rpx 30rpx;
}

.post-card {
  background-color: #fff;
  border-radius: 15rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  margin-right: 20rpx;
}

.user-detail {
  display: flex;
  flex-direction: column;
}

.user-name-row {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.user-name {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
}

.user-level {
  font-size: 20rpx;
  color: #ff9800;
  background-color: #fff3e0;
  padding: 2rpx 8rpx;
  border-radius: 8rpx;
}

.post-time {
  font-size: 24rpx;
  color: #999;
  margin-top: 5rpx;
}

.post-more {
  font-size: 40rpx;
  color: #999;
}

.post-content {
  margin-bottom: 20rpx;
}

.post-tag {
  display: inline-block;
  padding: 4rpx 12rpx;
  background-color: #e8f5e9;
  color: #4caf50;
  border-radius: 8rpx;
  font-size: 22rpx;
  margin-right: 10rpx;
  margin-bottom: 10rpx;
}

.post-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
}

.post-images {
  display: flex;
  gap: 10rpx;
  margin-bottom: 20rpx;
}

.image-item {
  width: 200rpx;
  height: 200rpx;
  border-radius: 10rpx;
  background-color: #f0f0f0;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 15rpx;
  background-color: #fffef0;
  border-radius: 10rpx;
  margin-bottom: 20rpx;
}

.product-tag {
  font-size: 24rpx;
  color: #8bc34a;
}

.product-price {
  font-size: 28rpx;
  color: #f44336;
  font-weight: bold;
}

.post-footer {
  display: flex;
  justify-content: space-around;
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;
}

.footer-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 24rpx;
  color: #666;
}

.footer-item .icon {
  font-size: 28rpx;
}

.bottom-space {
  height: 20rpx;
}

/* 底部导航栏容器 - 悬浮样式 */
.tabbar-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 30rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  z-index: 100;
  pointer-events: none;
}

.tabbar {
  background: #ffffff;
  border-radius: 50rpx;
  height: 120rpx;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -4rpx 30rpx rgba(0, 0, 0, 0.1);
  pointer-events: auto;
}

.tabbar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.tabbar-item.active .tabbar-icon {
  color: #4caf50;
}

.tabbar-item.active .tabbar-label {
  color: #4caf50;
}

.tabbar-icon {
  font-size: 44rpx;
  color: #666;
  margin-bottom: 4rpx;
}

.tabbar-label {
  font-size: 20rpx;
  color: #666;
}

/* 发布按钮特殊样式 */
.publish-btn {
  position: relative;
  top: -30rpx;
}

.publish-circle {
  width: 110rpx;
  height: 110rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #66bb6a 0%, #4caf50 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6rpx 20rpx rgba(76, 175, 80, 0.4);
}

.publish-circle .tabbar-icon {
  color: #fff;
  font-size: 50rpx;
  margin-bottom: 0;
}
</style>