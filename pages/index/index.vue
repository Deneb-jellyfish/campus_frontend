<!-- index.vue -->
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
    <HotTopics 
      :topics="topics"
      @topic-click="handleTopicClick"
      @more-click="handleTopicsMore"
    />

    <!-- 内容分类导航 -->
    <CategoryNav 
      :categories="categories"
      :current-category="currentCategory"
      :is-fixed="isNavFixed"
      @category-change="switchCategory"
    />

    <!-- 帖子列表 -->
    <view class="post-list">
      <PostCard 
        v-for="post in posts" 
        :key="post.id"
        :post="post"
        @user-click="handleUserClick"
        @more-click="handlePostMore"
        @post-click="handlePostClick"
        @image-click="handleImageClick"
        @product-click="handleProductClick"
        @comment-click="handleCommentClick"
        @like-click="handleLikeClick"
      />
    </view>

    <!-- 底部占位，防止被tabbar遮挡 -->
    <view class="bottom-space"></view>

    <!-- 底部导航栏 -->
    <TabBar 
      :current-tab="currentTab"
      @tab-change="switchTab"
    />
  </view>
</template>

<script>
import TabBar from '@/components/TabBar.vue';
import PostCard from '@/components/PostCard.vue';
import HotTopics from '@/components/HotTopics.vue';
import CategoryNav from '@/components/CategoryNav.vue';

export default {
  components: {
    TabBar,
    PostCard,
    HotTopics,
    CategoryNav
  },
  data() {
    return {
      currentTab: 'home',
      currentCategory: 0,
      isNavFixed: false,
      
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
  onShow() {
      // 隐藏系统原生的 TabBar，这样你的自定义组件才能显示出来
      uni.hideTabBar({
        animation: false // 不使用动画，防止闪烁
      });
    },
  onPageScroll(e) {
    // 监听页面滚动，判断分类导航是否需要吸顶
    this.isNavFixed = e.scrollTop > 400;
  },
  
  methods: {
    // 搜索
    goToSearch() {
      console.log('跳转到搜索页面');
      // uni.navigateTo({ url: '/pages/search/index' });
    },
    
    // 话题相关
    handleTopicClick(topic) {
      console.log('跳转到话题详情:', topic.id);
      // uni.navigateTo({ url: `/pages/topic/detail?id=${topic.id}` });
    },
    
    handleTopicsMore() {
      console.log('查看更多话题');
      // uni.navigateTo({ url: '/pages/topic/list' });
    },
    
    // 分类切换
    switchCategory(id) {
      this.currentCategory = id;
      console.log('切换分类:', id);
      // 可以在这里加载对应分类的帖子
    },
    
    // Tab切换
    switchTab(tabId) {
      if (tabId === 'publish') {
        console.log('打开发布页面');
        // uni.navigateTo({ url: '/pages/publish/index' });
      } else {
        this.currentTab = tabId;
        console.log('切换Tab:', tabId);
        // 可以在这里处理页面跳转
      }
    },
    
    // 帖子相关事件
    handleUserClick(post) {
      console.log('点击用户:', post.userName);
      // uni.navigateTo({ url: `/pages/user/profile?id=${post.userId}` });
    },
    
    handlePostMore(post) {
      console.log('帖子更多操作:', post.id);
      // 可以显示操作菜单：举报、收藏、分享等
    },
    
    handlePostClick(post) {
      console.log('进入帖子详情:', post.id);
      // uni.navigateTo({ url: `/pages/post/detail?id=${post.id}` });
    },
    
    handleImageClick({ post, imageIndex }) {
      console.log('查看图片:', post.id, '第', imageIndex + 1, '张');
      // uni.previewImage({ urls: post.images, current: imageIndex });
    },
    
    handleProductClick(post) {
      console.log('查看商品:', post.product);
      // uni.navigateTo({ url: `/pages/product/detail?id=${post.id}` });
    },
    
    handleCommentClick(post) {
      console.log('打开评论:', post.id);
      // 可以打开评论弹窗或跳转评论页
    },
    
    handleLikeClick({ post, isLiked }) {
      console.log('点赞状态:', post.id, isLiked ? '已点赞' : '取消点赞');
      // 调用API更新点赞状态
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

/* 帖子列表 */
.post-list {
  padding: 20rpx 30rpx;
}

.bottom-space {
  height: 20rpx;
}
</style>