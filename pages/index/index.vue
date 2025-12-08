<template>
  <view class="home-page">
    <!-- 顶部导航 - 吸顶 -->
    <view class="header" :class="{ 'is-fixed': isNavFixed }">
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

    <!-- 占位元素 -->
    <view class="header-placeholder" v-if="isNavFixed"></view>

    <!-- 搜索栏 -->
    <view class="search-bar" @click="goToSearch">
      <text class="search-icon">🔍</text>
      <input 
          class="search-input"
          type="text"
          v-model="keyword"
          placeholder="点我查找内容"
          @confirm="search"
        />
    </view>

    <!-- 热门话题 -->
    <HotTopics 
      :topics="topics"
      @topic-click="handleTopicClick"
      @more-click="handleTopicsMore"
    />

    <!-- 分类导航 -->
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
		@top-click="handleTopClick"
      />
    </view>

    <!-- 底部占位 -->
    <view class="bottom-space"></view>

    <!-- TabBar -->
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
import {userApi} from '@/api/user.js';
import { setPostTop } from '@/api/post.js';

// ⭐ 引入 API
import { 
  getHotTopics, 
  getCategories, 
  getPosts 
} from '@/api/index.js';

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

      topics: [],
      categories: [],
      posts: [],

      page: 1,
      pageSize: 10,
      hasMore: true,
    };
  },

  async onLoad() {
    await Promise.all([
      this.loadTopics(),
      this.loadCategories(),
      this.loadPosts()
    ]);
  },

  onShow() {
    uni.hideTabBar({ animation: false });
  },

  onPageScroll(e) {
    this.isNavFixed = e.scrollTop > 400;
  },

  methods: {
    /** 加载热门话题 */
    async loadTopics() {
      const res = await getHotTopics();
      if (res.code === 200) {
        this.topics = res.data;
      }
    },
	async handleTopClick(post) {
	  // 1. 获取当前用户积分
	  const userRes = await userApi.getUserInfo();
	  const user = userRes.data;
	
	  // 如果已经置顶 → 执行取消置顶
	  if (post.isTop) {
	    await setPostTop(post.id, false); // 取消置顶
	    uni.showToast({ title: '已取消置顶', icon: 'none' });
	    this.loadPosts(true);
	    return;
	  }
	
	  // 2. 未置顶 → 扣积分
	  if (user.points < 5) {
	    return uni.showToast({
	      title: '积分不足，置顶失败',
	      icon: 'none'
	    });
	  }
	
	  // 扣 5 积分
	  await userApi.updatePoints({ delta: -5 });
	
	  // 3. 调用置顶接口
	  const res = await setPostTop(post.id, true);
	
	  if (res.code === 200) {
	    uni.showToast({ title: '置顶成功', icon: 'success' });
	    this.loadPosts(true);
	  }
	},


    /** 加载分类 */
    async loadCategories() {
      const res = await getCategories();
      if (res.code === 200) {
        this.categories = res.data;
      }
    },

    /** 加载帖子列表 */
    async loadPosts(reset = true) {
      if (reset) {
        this.page = 1;
        this.posts = [];
      }
    
      const res = await getPosts({
        categoryId: this.currentCategory,
        page: this.page,
        pageSize: this.pageSize
      });
    
      if (res.code === 200) {
        const list = res.data.list;
    
        // 合并数据
        this.posts = reset ? list : [...this.posts, ...list];
        this.hasMore = res.data.hasMore;
    
        if (res.data.hasMore) {
          this.page++;
        }
    
        // ⭐ 新增：按置顶排序
        this.posts.sort((a, b) => {
          return (b.isTop ? 1 : 0) - (a.isTop ? 1 : 0);
        });
      }
    },


    /** 切换分类并重新加载 */
    async switchCategory(id) {
      this.currentCategory = id;
      await this.loadPosts(true);
    },

    goToSearch() {
      uni.navigateTo({ url: '/pages/search/index' });
    },

    handleTopicClick(post) {
      uni.navigateTo({ 
        url: `/pages/post/detail?id=${post.id}`
      });
    },

    handleTopicsMore() {
      uni.navigateTo({ url: '/pages/hot-posts/list' });
    },

    switchTab(tabId) {
      if (tabId === 'publish') {
        uni.navigateTo({ url: '/pages/publish/index' });
      } else {
        this.currentTab = tabId;
      }
    },

    handleUserClick(post) {
      uni.navigateTo({ url: `/pages/user/profile?id=${post.userId || post.id}` });
    },

    handlePostMore(post) {
      uni.showActionSheet({
        itemList: ['收藏', '分享', '举报']
      });
    },

    handlePostClick(post) {
      uni.navigateTo({ url: `/pages/post/detail?id=${post.id}` });
    },

    handleImageClick({ post, imageIndex }) {
      if (post.images && post.images.length > 0 && !post.images[0].startsWith('#')) {
        uni.previewImage({ urls: post.images, current: imageIndex });
      }
    },

    handleProductClick(post) {
      uni.navigateTo({ url: `/pages/post/detail?id=${post.id}` });
    },

    handleCommentClick(post) {
      uni.navigateTo({ url: `/pages/post/detail?id=${post.id}&focus=comment` });
    },

    handleLikeClick({ post, isLiked }) {
      console.log('点赞状态:', isLiked);
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
  transition: all 0.3s ease;
  z-index: 100;
}

/* 顶部导航吸顶样式 */
.header.is-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(232, 245, 233, 0.95); /* 半透明效果 */
  backdrop-filter: blur(20rpx);
  -webkit-backdrop-filter: blur(20rpx);
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

/* header 占位元素 */
.header-placeholder {
  height: 120rpx; /* 和 header 的高度一致 */
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