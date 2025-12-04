<template>
  <view class="publish-page">
    <!-- 顶部导航 -->
    

    <!-- 话题选择区域 -->
    <view class="topic-section">
      <view class="topic-header" @click="toggleTopicPanel">
        <text class="topic-title">选择话题</text>
        <view class="topic-hint">
          <text>选择合适的话题会有更多围观哦~</text>
          <text class="arrow" :class="{ expanded: showTopicPanel }">∧</text>
        </view>
      </view>
      
      <!-- 话题标签列表 -->
      <view v-show="showTopicPanel" class="topic-list">
        <view 
          v-for="topic in topicList" 
          :key="topic.id"
          class="topic-tag"
          :class="{ active: selectedTopic === topic.id }"
          @click="selectTopic(topic)"
        >
          <text v-if="topic.icon" class="topic-icon">{{ topic.icon }}</text>
          <text>{{ topic.name }}</text>
        </view>
      </view>
      
      <!-- 已选话题显示 -->
      <view v-if="selectedTopic && !showTopicPanel" class="selected-topic">
        <view class="topic-tag active">
          <text v-if="selectedTopicData.icon" class="topic-icon">{{ selectedTopicData.icon }}</text>
          <text>{{ selectedTopicData.name }}</text>
          <text class="remove-btn" @click.stop="clearTopic">×</text>
        </view>
      </view>
    </view>

    <!-- 内容输入区域 -->
    <view class="content-section">
      <textarea 
        class="content-input"
        v-model="content"
        placeholder="尽情发言吧..."
        :maxlength="2000"
        auto-height
      ></textarea>
      
      <!-- 字数统计 -->
      <view class="word-count">{{ content.length }}/2000</view>
    </view>

    <!-- 图片上传区域 -->
    <view class="image-section">
      <view class="image-list">
        <view 
          v-for="(img, index) in imageList" 
          :key="index" 
          class="image-item"
        >
          <image :src="img" mode="aspectFill" @click="previewImage(index)"></image>
          <view class="delete-btn" @click="deleteImage(index)">×</view>
        </view>
        
        <!-- 添加图片按钮 -->
        <view 
          v-if="imageList.length < 9" 
          class="add-image-btn" 
          @click="chooseImage"
        >
          <text class="add-icon">+</text>
        </view>
      </view>
      <text class="image-tip">最多上传9张图片</text>
    </view>

    <!-- 闲置商品信息（仅闲置话题显示） -->
    <view v-if="selectedTopic === 1" class="product-section">
      <view class="section-title">商品信息</view>
      
      <view class="form-item">
        <text class="label">价格</text>
        <view class="price-input-wrapper">
          <text class="price-symbol">¥</text>
          <input 
            class="price-input" 
            type="digit" 
            v-model="price" 
            placeholder="输入价格"
          />
        </view>
      </view>
      
      <view class="form-item">
        <text class="label">交易方式</text>
        <view class="trade-options">
          <view 
            class="trade-option"
            :class="{ active: tradeMethod === 'face' }"
            @click="tradeMethod = 'face'"
          >
            <text>当面交易</text>
          </view>
          <view 
            class="trade-option"
            :class="{ active: tradeMethod === 'delivery' }"
            @click="tradeMethod = 'delivery'"
          >
            <text>邮寄</text>
          </view>
          <view 
            class="trade-option"
            :class="{ active: tradeMethod === 'both' }"
            @click="tradeMethod = 'both'"
          >
            <text>都可以</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 投票选项（仅投票话题显示） -->
    <view v-if="selectedTopic === 4" class="vote-section">
      <view class="section-title">投票选项</view>
      
      <view 
        v-for="(option, index) in voteOptions" 
        :key="index" 
        class="vote-option-item"
      >
        <input 
          class="vote-input" 
          v-model="voteOptions[index]" 
          :placeholder="'选项' + (index + 1)"
        />
        <text 
          v-if="voteOptions.length > 2" 
          class="delete-option" 
          @click="removeVoteOption(index)"
        >×</text>
      </view>
      
      <view 
        v-if="voteOptions.length < 6" 
        class="add-option-btn" 
        @click="addVoteOption"
      >
        <text>+ 添加选项</text>
      </view>
    </view>

    <!-- 更多设置 -->
    <view class="more-settings">
      <view class="setting-item" @click="toggleAnonymous">
        <text class="setting-label">匿名发布</text>
        <view class="switch" :class="{ active: isAnonymous }">
          <view class="switch-dot"></view>
        </view>
      </view>
    </view>

    <!-- 底部发布按钮 -->
    <view class="bottom-bar">
      <view 
        class="publish-btn" 
        :class="{ disabled: !canPublish }"
        @click="handlePublish"
      >
        发布
      </view>
    </view>
  </view>
</template>

<script>
import { publishPost } from '../../api/post.js';

export default {
  data() {
    return {
      // 话题相关
      showTopicPanel: true,
      selectedTopic: null,
      topicList: [
        { id: 1, name: '闲置', icon: '' },
        { id: 2, name: '求助', icon: '' },
        { id: 3, name: '日常生活', icon: '' },
        { id: 4, name: '投票', icon: '' },
        { id: 5, name: '吐槽', icon: '' },
        { id: 6, name: '校招', icon: '' },
        { id: 7, name: '投稿', icon: '' },
        { id: 8, name: '漫金山', icon: '💧' },
        { id: 9, name: '求购', icon: '' },
        { id: 10, name: '悬赏', icon: '' },
        { id: 11, name: '租房', icon: '' },
        { id: 12, name: '帮转', icon: '' },
        { id: 13, name: '找人', icon: '' },
        { id: 14, name: '寻物招领', icon: '' },
        { id: 15, name: '公告', icon: '' },
        { id: 16, name: '求问', icon: '' },
        { id: 17, name: '卖室友', icon: '' },
        { id: 18, name: '选课交流', icon: '' }
      ],
      
      // 内容相关
      content: '',
      imageList: [],
      
      // 闲置商品相关
      price: '',
      tradeMethod: 'face',
      
      // 投票相关
      voteOptions: ['', ''],
      
      // 设置
      isAnonymous: false,
      
      // 发布状态
      publishing: false
    };
  },
  
  computed: {
    // 已选话题数据
    selectedTopicData() {
      return this.topicList.find(t => t.id === this.selectedTopic) || {};
    },
    
    // 是否可以发布
    canPublish() {
      // 必须有内容或图片
      const hasContent = this.content.trim().length > 0 || this.imageList.length > 0;
      
      // 如果是闲置，必须有价格
      if (this.selectedTopic === 1 && !this.price) {
        return false;
      }
      
      // 如果是投票，必须至少有2个非空选项
      if (this.selectedTopic === 4) {
        const validOptions = this.voteOptions.filter(o => o.trim());
        if (validOptions.length < 2) {
          return false;
        }
      }
      
      return hasContent && !this.publishing;
    }
  },
  
  methods: {
    // 返回
    goBack() {
      uni.navigateBack();
    },
    
    // 切换话题面板
    toggleTopicPanel() {
      this.showTopicPanel = !this.showTopicPanel;
    },
    
    // 选择话题
    selectTopic(topic) {
      this.selectedTopic = topic.id;
      this.showTopicPanel = false;
    },
    
    // 清除话题
    clearTopic() {
      this.selectedTopic = null;
      this.showTopicPanel = true;
    },
    
    // 选择图片
    chooseImage() {
      const remainCount = 9 - this.imageList.length;
      
      uni.chooseImage({
        count: remainCount,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.imageList = [...this.imageList, ...res.tempFilePaths];
        }
      });
    },
    
    // 预览图片
    previewImage(index) {
      uni.previewImage({
        current: index,
        urls: this.imageList
      });
    },
    
    // 删除图片
    deleteImage(index) {
      this.imageList.splice(index, 1);
    },
    
    // 添加投票选项
    addVoteOption() {
      if (this.voteOptions.length < 6) {
        this.voteOptions.push('');
      }
    },
    
    // 移除投票选项
    removeVoteOption(index) {
      if (this.voteOptions.length > 2) {
        this.voteOptions.splice(index, 1);
      }
    },
    
    // 切换匿名
    toggleAnonymous() {
      this.isAnonymous = !this.isAnonymous;
    },
    
    // 发布帖子
    async handlePublish() {
      if (!this.canPublish || this.publishing) return;
      
      // 验证
      if (!this.content.trim() && this.imageList.length === 0) {
        uni.showToast({ title: '请输入内容或上传图片', icon: 'none' });
        return;
      }
      
      this.publishing = true;
      
      try {
        const postData = {
          topicId: this.selectedTopic,
          topicName: this.selectedTopicData.name,
          content: this.content,
          images: this.imageList,
          isAnonymous: this.isAnonymous
        };
        
        // 闲置商品信息
        if (this.selectedTopic === 1) {
          postData.product = {
            price: parseFloat(this.price) || 0,
            tradeMethod: this.tradeMethod
          };
        }
        
        // 投票信息
        if (this.selectedTopic === 4) {
          postData.vote = {
            options: this.voteOptions.filter(o => o.trim())
          };
        }
        
        const res = await publishPost(postData);
        
        if (res.code === 200) {
          uni.showToast({ title: '发布成功', icon: 'success' });
          
          // 延迟返回
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        } else {
          uni.showToast({ title: res.message || '发布失败', icon: 'none' });
        }
      } catch (error) {
        console.error('发布失败:', error);
        uni.showToast({ title: '发布失败，请重试', icon: 'none' });
      } finally {
        this.publishing = false;
      }
    }
  }
};
</script>

<style scoped>
.publish-page {
  min-height: 100vh;
  background-color: #fff;
  padding-bottom: 140rpx;
}

/* 顶部导航 */
.nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #eee;
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 100;
}

.close-btn {
  font-size: 50rpx;
  color: #333;
  padding: 10rpx;
  line-height: 1;
}

.nav-title {
  font-size: 34rpx;
  font-weight: bold;
  color: #333;
}

.placeholder {
  width: 70rpx;
}

/* 话题选择区域 */
.topic-section {
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.topic-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.topic-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.topic-hint {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  color: #b0dfbd;
}

.arrow {
  margin-left: 10rpx;
  transition: transform 0.3s;
}

.arrow.expanded {
  transform: rotate(180deg);
}

.topic-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  margin-top: 20rpx;
}

.topic-tag {
  display: flex;
  align-items: center;
  padding: 16rpx 28rpx;
  background-color: #f5f5f5;
  border-radius: 30rpx;
  font-size: 28rpx;
  color: #666;
}

.topic-tag.active {
  background-color: #E8F5E9;
  color: #4CAF50;
}

.topic-icon {
  margin-right: 6rpx;
}

.selected-topic {
  margin-top: 20rpx;
}

.selected-topic .topic-tag {
  display: inline-flex;
}

.remove-btn {
  margin-left: 10rpx;
  font-size: 28rpx;
  color: #999;
}

/* 内容输入区域 */
.content-section {
  padding: 30rpx;
  min-height: 300rpx;
}

.content-input {
  width: 100%;
  min-height: 200rpx;
  font-size: 30rpx;
  color: #333;
  line-height: 1.6;
}

.word-count {
  text-align: right;
  font-size: 24rpx;
  color: #999;
  margin-top: 20rpx;
}

/* 图片上传区域 */
.image-section {
  padding: 0 30rpx 30rpx;
}

.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.image-item {
  position: relative;
  width: 200rpx;
  height: 200rpx;
}

.image-item image {
  width: 100%;
  height: 100%;
  border-radius: 12rpx;
}

.image-item .delete-btn {
  position: absolute;
  top: -15rpx;
  right: -15rpx;
  width: 40rpx;
  height: 40rpx;
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
}

.add-image-btn {
  width: 200rpx;
  height: 200rpx;
  background-color: #f5f5f5;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-icon {
  font-size: 60rpx;
  color: #ccc;
}

.image-tip {
  font-size: 24rpx;
  color: #999;
  margin-top: 20rpx;
}

/* 商品信息区域 */
.product-section,
.vote-section {
  padding: 30rpx;
  border-top: 16rpx solid #f5f5f5;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 30rpx;
}

.form-item {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
}

.label {
  width: 140rpx;
  font-size: 28rpx;
  color: #666;
}

.price-input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 12rpx;
  padding: 0 20rpx;
}

.price-symbol {
  font-size: 32rpx;
  color: #ff6b00;
  margin-right: 10rpx;
}

.price-input {
  flex: 1;
  height: 80rpx;
  font-size: 32rpx;
  color: #ff6b00;
}

.trade-options {
  flex: 1;
  display: flex;
  gap: 20rpx;
}

.trade-option {
  padding: 16rpx 24rpx;
  background-color: #f5f5f5;
  border-radius: 12rpx;
  font-size: 26rpx;
  color: #666;
}

.trade-option.active {
  background-color: #E8F5E9;
  color: #4CAF50;
}

/* 投票选项 */
.vote-option-item {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.vote-input {
  flex: 1;
  height: 80rpx;
  background-color: #f5f5f5;
  border-radius: 12rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
}

.delete-option {
  width: 60rpx;
  text-align: center;
  font-size: 36rpx;
  color: #999;
}

.add-option-btn {
  padding: 20rpx;
  text-align: center;
  color: #4CAF50;
  font-size: 28rpx;
}

/* 更多设置 */
.more-settings {
  padding: 30rpx;
  border-top: 16rpx solid #f5f5f5;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
}

.setting-label {
  font-size: 30rpx;
  color: #333;
}

.switch {
  width: 100rpx;
  height: 56rpx;
  background-color: #e0e0e0;
  border-radius: 28rpx;
  padding: 6rpx;
  transition: background-color 0.3s;
}

.switch.active {
  background-color: #4CAF50;
}

.switch-dot {
  width: 44rpx;
  height: 44rpx;
  background-color: #fff;
  border-radius: 50%;
  transition: transform 0.3s;
}

.switch.active .switch-dot {
  transform: translateX(44rpx);
}

/* 底部发布按钮 */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 30rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background-color: #fff;
  border-top: 1rpx solid #eee;
}

.publish-btn {
  height: 90rpx;
  background: linear-gradient(135deg, #b0dfbd, #bdeeca);
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
  border-radius: 45rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.publish-btn.disabled {
  background: #ccc;
}
</style>