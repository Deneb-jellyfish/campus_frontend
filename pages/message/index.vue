<template>
  <view class="message-page">
    <!-- 顶部标题 -->
    <view class="header">
      <text class="title">消息</text>
    </view>

    <!-- Tab 切换 -->
    <view class="tab-bar">
      <view 
        class="tab-item" 
        :class="{ active: currentTab === 'chat' }"
        @click="switchTab('chat')"
      >
        <text>私信</text>
        <view v-if="unreadChat > 0" class="badge">{{ unreadChat }}</view>
      </view>
      <view 
        class="tab-item" 
        :class="{ active: currentTab === 'notification' }"
        @click="switchTab('notification')"
      >
        <text>赞评</text>
        <view v-if="unreadNotify > 0" class="badge">{{ unreadNotify }}</view>
      </view>
    </view>

    <!-- 私信列表 -->
    <view v-if="currentTab === 'chat'" class="message-list">
      <view 
        v-for="item in chatList" 
        :key="item.id" 
        class="message-card"
        @click="goToChat(item)"
      >
        <image class="avatar" :src="item.avatar" mode="aspectFill"></image>
        <view class="message-info">
          <text class="username">{{ item.username }}</text>
          <text class="content">{{ item.lastMessage }}</text>
        </view>
        <!-- 右侧：时间在上，未读在下 -->
        <view class="message-right">
          <text class="time">{{ item.time }}</text>
          <view v-if="item.unread > 0" class="unread-dot">{{ item.unread }}</view>
        </view>
      </view>
      
      <view v-if="chatList.length === 0" class="empty-tip">
        暂无私信消息
      </view>
    </view>

    <!-- 赞评列表 -->
    <view v-if="currentTab === 'notification'" class="message-list">
      <view 
        v-for="item in notifyList" 
        :key="item.id" 
        class="notify-card"
      >
        <image class="avatar" :src="item.avatar" mode="aspectFill"></image>
        <view class="notify-info">
          <view class="info-header">
            <text class="username">{{ item.username }}</text>
            <text class="notify-type">{{ item.typeText }} {{ item.time }}</text>
          </view>
          <view v-if="item.quote" class="quote-content">
            {{ item.quote }}
          </view>
          <text v-if="item.content" class="content">{{ item.content }}</text>
          <view class="reply-btn" @click="handleReply(item)">回复</view>
        </view>
      </view>
      
      <view v-if="notifyList.length === 0" class="empty-tip">
        暂无赞评消息
      </view>
    </view>

    <!-- 底部占位 -->
    <view class="bottom-space"></view>

    <!-- 底部导航栏 -->
    <TabBar 
      :current-tab="'message'"
      @tab-change="handleTabChange"
    />
  </view>
</template>

<script>
import TabBar from '@/components/TabBar.vue';
import { getChatList, getNotifyList } from '../../api/message.js';

export default {
  components: {
    TabBar
  },
  data() {
    return {
      currentTab: 'chat',
      chatList: [],
      notifyList: [],
      unreadChat: 0,
      unreadNotify: 0
    };
  },
  
  onLoad() {
    this.initData();
  },
  
  methods: {
    async initData() {
      await Promise.all([
        this.fetchChatList(),
        this.fetchNotifyList()
      ]);
    },
    
    async fetchChatList() {
      try {
        const res = await getChatList();
        if (res.code === 200) {
          this.chatList = res.data.list;
          this.unreadChat = res.data.unreadCount;
        }
      } catch (error) {
        console.error('获取私信列表失败:', error);
      }
    },
    
    async fetchNotifyList() {
      try {
        const res = await getNotifyList();
        if (res.code === 200) {
          this.notifyList = res.data.list;
          this.unreadNotify = res.data.unreadCount;
        }
      } catch (error) {
        console.error('获取赞评列表失败:', error);
      }
    },
    
    switchTab(tab) {
      this.currentTab = tab;
    },
    
    goToChat(item) {
      console.log('进入聊天:', item.username);
    },
    
    handleReply(item) {
      console.log('回复:', item);
    },
    
    handleTabChange(tabId) {
      if (tabId !== 'message') {
        console.log('切换到:', tabId);
      }
    }
  }
};
</script>

<style scoped>
.message-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 150rpx;
}

/* 顶部标题 */
.header {
  padding: 30rpx;
  background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

/* Tab 切换栏 */
.tab-bar {
  display: flex;
  background-color: transparent;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #eee;
}

.tab-item {
  position: relative;
  margin-right: 60rpx;
  padding: 10rpx 0;
  font-size: 30rpx;
  color: #666;
}

.tab-item.active {
  color: #4CAF50;
  font-weight: bold;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40rpx;
  height: 6rpx;
  background-color: #4CAF50;
  border-radius: 3rpx;
}

.badge {
  position: absolute;
  top: -10rpx;
  right: -30rpx;
  min-width: 32rpx;
  height: 32rpx;
  padding: 0 8rpx;
  background-color: #ff4d4f;
  color: #fff;
  font-size: 20rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 消息列表 */
.message-list {
  padding: 20rpx 30rpx;
}

/* 私信卡片 */
.message-card {
  display: flex;
  align-items: center;
  padding: 30rpx;
  background-color: #fff;
  border-radius: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  margin-right: 20rpx;
  background-color: #e8f5e9;
  flex-shrink: 0;
}

.message-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.username {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.message-info .content {
  font-size: 26rpx;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 右侧区域：时间在上，未读在下 */
.message-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  height: 100rpx;
  margin-left: 20rpx;
  flex-shrink: 0;
}

.message-right .time {
  font-size: 24rpx;
  color: #999;
}

.unread-dot {
  min-width: 36rpx;
  height: 36rpx;
  padding: 0 10rpx;
  background-color: #ff4d4f;
  color: #fff;
  font-size: 22rpx;
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 赞评卡片 */
.notify-card {
  display: flex;
  padding: 30rpx;
  background-color: #fff;
  border-radius: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.notify-info {
  flex: 1;
  overflow: hidden;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.notify-type {
  font-size: 24rpx;
  color: #999;
}

.notify-info .content {
  font-size: 26rpx;
  color: #666;
}

/* 引用内容 */
.quote-content {
  margin-top: 15rpx;
  padding: 20rpx;
  background-color: #f5f5f5;
  border-radius: 10rpx;
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
}

/* 回复按钮 */
.reply-btn {
  display: inline-block;
  margin-top: 15rpx;
  padding: 10rpx 30rpx;
  background-color: #e8f5e9;
  color: #4CAF50;
  font-size: 24rpx;
  border-radius: 30rpx;
}

/* 空状态 */
.empty-tip {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}

.bottom-space {
  height: 20rpx;
}
</style>
