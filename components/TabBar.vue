<template>
  <view class="tabbar-container">
    <view class="tabbar">
      <view 
        class="tabbar-item" 
        v-for="(item, index) in tabbarList" 
        :key="index"
        :class="{ active: currentTab === item.id, 'publish-btn': item.id === 'publish' }"
        @click="handleTabClick(item.id)"
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
</template>

<script>
export default {
  name: 'TabBar',
  props: {
    currentTab: {
      type: String,
      default: 'home'
    }
  },
  data() {
    return {
      tabbarList: [
        { id: 'home', label: '首页', icon: '🏠' },
        { id: 'circle', label: '跑腿', icon: '👥' },
        { id: 'publish', label: '', icon: '➕' },
        { id: 'message', label: '消息', icon: '💬' },
        { id: 'profile', label: '我的', icon: '👤' }
      ]
    };
  },
  methods: {
    handleTabClick(tabId) {
      this.$emit('tab-change', tabId);
    }
  }
};
</script>

<style scoped>
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