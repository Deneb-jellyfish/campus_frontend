<template>
  <view class="tabbar-container">
    <view class="tabbar">
      <view 
        class="tabbar-item" 
        v-for="(item, index) in tabbarList" 
        :key="index"
        :class="{ active: currentTab === item.id, 'publish-btn': item.id === 'publish' }"
        @click="handleTabClick(item)"
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
        { id: 'home', label: '首页', icon: '🏠', path: '/pages/index/index' },
        { id: 'circle', label: '跑腿', icon: '👥', path: '/pages/errand/index' },
        { id: 'publish', label: '', icon: '➕', path: '/pages/publish/index' },
        { id: 'message', label: '消息', icon: '💬', path: '/pages/message/index' },
        { id: 'profile', label: '我的', icon: '👤', path: '/pages/profile/index' }
      ]
    };
  },
  methods: {
    handleTabClick(item) {
      // 如果点击的是当前页面，不做任何操作
      if (item.id === this.currentTab) {
        return;
      }
      
      // 发布按钮特殊处理（可以用 navigateTo 打开新页面）
      if (item.id === 'publish') {
        uni.navigateTo({
          url: item.path,
          fail: (err) => {
            console.log('页面跳转失败:', err);
          }
        });
      } else {
        // 其他页面使用 redirectTo（替换当前页面，不保留历史）
        uni.redirectTo({
          url: item.path,
          fail: (err) => {
            console.log('页面跳转失败:', err);
          }
        });
      }
      
      // 同时触发事件（可选）
      this.$emit('tab-change', item.id);
    }
  }
};
</script>

<style scoped>
/* 样式保持不变 */
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