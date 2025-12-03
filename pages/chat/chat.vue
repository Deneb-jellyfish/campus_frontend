<template>
  <view class="chat-page">
    <!-- 消息列表 -->
    <scroll-view 
      class="message-list" 
      scroll-y 
      :scroll-into-view="scrollIntoView"
      :scroll-with-animation="true"
    >
      <view 
        v-for="(msg, index) in messages" 
        :key="msg.id"
        :id="`msg-${index}`"
        class="message-item"
        :class="{ self: msg.isSelf }"
      >
        <!-- 时间分割线 -->
        <view v-if="showTime(msg, index)" class="time-divider">
          {{ formatTime(msg.createTime) }}
        </view>
        
        <view class="message-content">
          <!-- 头像 -->
          <image 
            :src="msg.isSelf ? userStore.avatar : otherUserAvatar" 
            class="avatar"
            mode="aspectFill"
          />
          
          <!-- 消息气泡 -->
          <view class="bubble-wrapper">
            <!-- 文本消息 -->
            <view v-if="msg.type === 'text'" class="bubble text-bubble">
              {{ msg.content }}
            </view>
            
            <!-- 图片消息 -->
            <image 
              v-else-if="msg.type === 'image'" 
              :src="msg.content"
              class="bubble image-bubble"
              mode="widthFix"
              @click="previewImage(msg.content)"
            />
            
            <!-- 语音消息 -->
            <view v-else-if="msg.type === 'voice'" class="bubble voice-bubble">
              <image class="voice-icon" src="../../static/icons/voice.png" />
              <text>{{ msg.duration }}"</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 加载更多 -->
      <view v-if="hasMore" class="load-more" @click="loadMore">
        查看更多消息
      </view>
    </scroll-view>
    
    <!-- 输入栏 -->
    <view class="input-bar">
      <image 
        class="tool-icon" 
        src="../../static/icons/voice.png"
        @click="toggleVoice"
      />
      
      <view class="input-wrapper">
        <input 
          v-model="inputText"
          class="input"
          placeholder="说点什么..."
          :focus="inputFocus"
          @confirm="sendMessage"
        />
      </view>
      
      <image 
        class="tool-icon" 
        src="../../static/icons/emoji.png"
        @click="toggleEmoji"
      />
      
      <image 
        class="tool-icon" 
        src="../../static/icons/add.png"
        @click="showMoreActions"
      />
      
      <view 
        v-if="inputText.trim()"
        class="send-btn"
        @click="sendMessage"
      >
        发送
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useUserStore } from '@/stores/user'
import { useChatStore } from '@/stores/chat'
import { chatApi } from '@/api'

const userStore = useUserStore()
const chatStore = useChatStore()

const otherUserId = ref('')
const otherUserAvatar = ref('')
const messages = ref([])
const inputText = ref('')
const inputFocus = ref(false)
const scrollIntoView = ref('')
const hasMore = ref(true)
const page = ref(1)

// WebSocket URL（根据实际环境配置）
const WS_URL = 'wss://your-domain.com/ws'

onMounted(() => {
  // 获取路由参数
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  otherUserId.value = currentPage.options.userId
  
  // 初始化 WebSocket
  if (!chatStore.isConnected) {
    chatStore.initWebSocket(WS_URL, userStore.token)
  }
  
  // 加载聊天记录
  loadChatHistory()
  
  // 监听新消息
  watchNewMessage()
})

onUnmounted(() => {
  // 页面销毁时不关闭 WebSocket，保持连接
})

// 加载聊天记录
const loadChatHistory = async () => {
  try {
    const res = await chatApi.getChatHistory(otherUserId.value, {
      page: page.value,
      pageSize: 20
    })
    
    const newMessages = res.list.map(msg => ({
      ...msg,
      isSelf: msg.fromUserId === userStore.userId
    }))
    
    messages.value = [...newMessages, ...messages.value]
    hasMore.value = res.hasMore
    
    if (page.value === 1) {
      scrollToBottom()
    }
  } catch (error) {
    console.error('加载聊天记录失败:', error)
  }
}

// 监听新消息
const watchNewMessage = () => {
  // 从 store 中获取当前会话的新消息
  const currentMessages = chatStore.currentMessages
  if (currentMessages && currentMessages.length > messages.value.length) {
    const newMsg = currentMessages[currentMessages.length - 1]
    if (newMsg.fromUserId === otherUserId.value || newMsg.fromUserId === userStore.userId) {
      messages.value.push({
        ...newMsg,
        isSelf: newMsg.fromUserId === userStore.userId
      })
      scrollToBottom()
    }
  }
}

// 发送消息
const sendMessage = () => {
  if (!inputText.value.trim()) return
  
  const message = {
    type: 'text',
    content: inputText.value,
    toUserId: otherUserId.value,
    fromUserId: userStore.userId,
    createTime: Date.now()
  }
  
  // 通过 WebSocket 发送
  chatStore.sendMessage(message)
  
  // 添加到本地消息列表
  messages.value.push({
    ...message,
    isSelf: true,
    id: Date.now()
  })
  
  inputText.value = ''
  scrollToBottom()
}

// 加载更多
const loadMore = () => {
  page.value++
  loadChatHistory()
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    scrollIntoView.value = `msg-${messages.value.length - 1}`
  })
}

// 是否显示时间
const showTime = (msg, index) => {
  if (index === 0) return true
  const prevMsg = messages.value[index - 1]
  return msg.createTime - prevMsg.createTime > 5 * 60 * 1000 // 5分钟
}

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const msgDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  
  if (msgDate.getTime() === today.getTime()) {
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
  } else {
    return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
  }
}

// 预览图片
const previewImage = (url) => {
  uni.previewImage({
    urls: [url],
    current: url
  })
}

// 切换语音
const toggleVoice = () => {
  uni.showToast({
    title: '语音功能开发中',
    icon: 'none'
  })
}

// 切换表情
const toggleEmoji = () => {
  uni.showToast({
    title: '表情功能开发中',
    icon: 'none'
  })
}

// 显示更多操作
const showMoreActions = () => {
  uni.showActionSheet({
    itemList: ['相册', '拍摄', '位置'],
    success: (res) => {
      if (res.tapIndex === 0) {
        chooseImage()
      }
    }
  })
}

// 选择图片
const chooseImage = () => {
  uni.chooseImage({
    count: 1,
    success: async (res) => {
      // 上传图片逻辑
      console.log('选择图片:', res)
    }
  })
}
</script>

<style lang="scss" scoped>
.chat-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #F5F5F5;
}

.message-list {
  flex: 1;
  padding: 20rpx;
  overflow-y: auto;
}

.message-item {
  margin-bottom: 32rpx;
  
  &.self {
    .message-content {
      flex-direction: row-reverse;
    }
    
    .bubble {
      background: #95DE64;
      color: #333333;
    }
  }
}

.time-divider {
  text-align: center;
  font-size: 24rpx;
  color: #999999;
  margin: 20rpx 0;
}

.message-content {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
}

.avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  flex-shrink: 0;
}

.bubble-wrapper {
  max-width: 480rpx;
}

.bubble {
  padding: 20rpx 24rpx;
  border-radius: 12rpx;
  background: #FFFFFF;
  word-break: break-all;
}

.text-bubble {
  font-size: 28rpx;
  line-height: 1.5;
  color: #333333;
}

.image-bubble {
  padding: 0;
  max-width: 400rpx;
  border-radius: 12rpx;
}

.voice-bubble {
  display: flex;
  align-items: center;
  gap: 12rpx;
  min-width: 120rpx;
}

.voice-icon {
  width: 32rpx;
  height: 32rpx;
}

.load-more {
  text-align: center;
  padding: 20rpx;
  font-size: 24rpx;
  color: #52C41A;
}

.input-bar {
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx;
  background: #FFFFFF;
  border-top: 1rpx solid #E5E5E5;
  gap: 20rpx;
}

.tool-icon {
  width: 48rpx;
  height: 48rpx;
  flex-shrink: 0;
}

.input-wrapper {
  flex: 1;
  background: #F5F5F5;
  border-radius: 40rpx;
  padding: 0 24rpx;
}

.input {
  width: 100%;
  height: 72rpx;
  font-size: 28rpx;
}

.send-btn {
  padding: 12rpx 32rpx;
  background: #52C41A;
  color: #FFFFFF;
  font-size: 28rpx;
  border-radius: 40rpx;
}
</style>