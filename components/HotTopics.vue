<template>
  <view class="hot-topics-card">
    <view class="card-header">
      <text class="card-title">🔥 热门话题</text>
      <text class="more-btn" @click="handleMoreClick">查看更多 ›</text>
    </view>
    <view class="topics-container">
      <view 
        class="topic-item" 
        v-for="topic in topics" 
        :key="topic.id" 
        @click="handleTopicClick(topic)"
      >
        <view class="topic-content">
          <text class="topic-tag">#</text>
          <text class="topic-title">{{ topic.title }}</text>
          <text class="topic-icon">{{ topic.hot ? '🔥' : '' }}</text>
        </view>
        <view class="topic-meta">
          <text class="topic-views">累计{{ topic.views }}人气</text>
          <view class="topic-avatars">
            <text 
              v-for="(avatar, index) in topic.participants" 
              :key="index" 
              class="avatar-small"
            >
              {{ avatar }}
            </text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'HotTopics',
  props: {
    topics: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handleTopicClick(topic) {
      this.$emit('topic-click', topic);
    },
    handleMoreClick() {
      this.$emit('more-click');
    }
  }
};
</script>

<style scoped>
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
</style>