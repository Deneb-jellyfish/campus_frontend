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

// 引入 API（mock数据）
import { getHotTopics, getCategories, getPosts, toggleLike } from '../../api/index.js';

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
      
      // 数据（初始为空，从mock获取）
      topics: [],
      categories: [],
      posts: []
    };
  },
  
  onLoad() {
    this.initData();
  },
  
  onPageScroll(e) {
    // 监听页面滚动，判断分类导航是否需要吸顶
    this.isNavFixed = e.scrollTop > 400;
  },
  
  methods: {
    // 初始化数据
    async initData() {
      await Promise.all([
        this.fetchTopics(),
        this.fetchCategories(),
        this.fetchPosts()
      ]);
    },
    
    // 获取热门话题
    async fetchTopics() {
      try {
        const res = await getHotTopics();
        if (res.code === 200) {
          this.topics = res.data;
        }
      } catch (error) {
        console.error('获取话题失败:', error);
      }
    },
    
    // 获取分类
    async fetchCategories() {
      try {
        const res = await getCategories();
        if (res.code === 200) {
          this.categories = res.data;
        }
      } catch (error) {
        console.error('获取分类失败:', error);
      }
    },
    
    // 获取帖子列表
    async fetchPosts() {
      try {
        const res = await getPosts({
          categoryId: this.currentCategory
        });
        if (res.code === 200) {
          this.posts = res.data.list;
        }
      } catch (error) {
        console.error('获取帖子失败:', error);
      }
    },
    
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
      this.fetchPosts(); // 重新获取帖子
    },
    
    // Tab切换
    switchTab(tabId) {
      if (tabId === 'publish') {
        console.log('打开发布页面');
        // uni.navigateTo({ url: '/pages/publish/index' });
      } else {
        this.currentTab = tabId;
        console.log('切换Tab:', tabId);
      }
    },
    
    // 帖子相关事件
    handleUserClick(post) {
      console.log('点击用户:', post.userName);
      // uni.navigateTo({ url: `/pages/user/profile?id=${post.userId}` });
    },
    
    handlePostMore(post) {
      console.log('帖子更多操作:', post.id);
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
    },
    
    async handleLikeClick({ post, isLiked }) {
      console.log('点赞状态:', post.id, isLiked ? '已点赞' : '取消点赞');
      try {
        await toggleLike(post.id, isLiked);
      } catch (error) {
        console.error('点赞失败:', error);
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

/* 帖子列表 */
.post-list {
  padding: 20rpx 30rpx;
}

.bottom-space {
  height: 20rpx;
}
</style>