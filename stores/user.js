// stores/user.js - 用户状态管理 (Pinia)

import { defineStore } from 'pinia'
import { userApi } from '@/api'
import { setToken, removeToken, getToken } from '@/utils/request'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken() || '',
    userInfo: null,
    isLogin: false
  }),
  
  getters: {
    // 获取用户头像
    avatar: (state) => state.userInfo?.avatar || '',
    
    // 获取用户昵称
    nickname: (state) => state.userInfo?.nickname || '未登录',
    
    // 获取用户ID
    userId: (state) => state.userInfo?.id || null
  },
  
  actions: {
    /**
     * 登录
     */
    async login(loginData) {
      try {
        const res = await userApi.login(loginData)
        this.token = res.token
        this.userInfo = res.userInfo
        this.isLogin = true
        
        // 保存 Token
        setToken(res.token)
        
        return res
      } catch (error) {
        console.error('登录失败:', error)
        throw error
      }
    },
    
    /**
     * 获取用户信息
     */
    async fetchUserInfo() {
      try {
        const userInfo = await userApi.getUserInfo()
        this.userInfo = userInfo
        this.isLogin = true
        return userInfo
      } catch (error) {
        console.error('获取用户信息失败:', error)
        throw error
      }
    },
    
    /**
     * 更新用户信息
     */
    async updateUserInfo(data) {
      try {
        const userInfo = await userApi.updateUserInfo(data)
        this.userInfo = { ...this.userInfo, ...userInfo }
        return userInfo
      } catch (error) {
        console.error('更新用户信息失败:', error)
        throw error
      }
    },
    
    /**
     * 退出登录
     */
    logout() {
      this.token = ''
      this.userInfo = null
      this.isLogin = false
      removeToken()
      
      // 跳转到登录页
      uni.reLaunch({
        url: '/pages/login/login'
      })
    },
    
    /**
     * 检查登录状态
     */
    checkLogin() {
      if (!this.token) {
        uni.showModal({
          title: '提示',
          content: '请先登录',
          confirmText: '去登录',
          success: (res) => {
            if (res.confirm) {
              uni.navigateTo({
                url: '/pages/login/login'
              })
            }
          }
        })
        return false
      }
      return true
    }
  }
})


// stores/chat.js - 聊天状态管理
export const useChatStore = defineStore('chat', {
  state: () => ({
    socket: null,
    isConnected: false,
    conversationList: [],
    currentConversation: null,
    messages: {},
    unreadCount: 0
  }),
  
  getters: {
    // 获取当前会话消息
    currentMessages: (state) => {
      if (!state.currentConversation) return []
      return state.messages[state.currentConversation.id] || []
    },
    
    // 获取未读消息数
    totalUnread: (state) => {
      return state.conversationList.reduce((total, conv) => total + (conv.unreadCount || 0), 0)
    }
  },
  
  actions: {
    /**
     * 初始化 WebSocket
     */
    initWebSocket(url, token) {
      if (this.socket) {
        this.socket.close()
      }
      
      this.socket = uni.connectSocket({
        url: `${url}?token=${token}`,
        success: () => {
          console.log('WebSocket 连接成功')
        }
      })
      
      // 监听连接打开
      this.socket.onOpen(() => {
        this.isConnected = true
        console.log('WebSocket 已连接')
      })
      
      // 监听消息接收
      this.socket.onMessage((res) => {
        const data = JSON.parse(res.data)
        this.handleMessage(data)
      })
      
      // 监听连接关闭
      this.socket.onClose(() => {
        this.isConnected = false
        console.log('WebSocket 已断开')
        
        // 5秒后尝试重连
        setTimeout(() => {
          if (!this.isConnected) {
            this.initWebSocket(url, token)
          }
        }, 5000)
      })
      
      // 监听错误
      this.socket.onError((err) => {
        console.error('WebSocket 错误:', err)
        this.isConnected = false
      })
    },
    
    /**
     * 处理接收到的消息
     */
    handleMessage(data) {
      const { type, message } = data
      
      if (type === 'message') {
        // 新消息
        const conversationId = message.conversationId
        if (!this.messages[conversationId]) {
          this.messages[conversationId] = []
        }
        this.messages[conversationId].push(message)
        
        // 更新会话列表
        const conversation = this.conversationList.find(c => c.id === conversationId)
        if (conversation) {
          conversation.lastMessage = message
          conversation.lastTime = message.createTime
          if (message.fromUserId !== this.currentConversation?.otherUserId) {
            conversation.unreadCount = (conversation.unreadCount || 0) + 1
          }
        }
      }
    },
    
    /**
     * 发送消息
     */
    sendMessage(message) {
      if (!this.isConnected) {
        uni.showToast({
          title: '连接已断开',
          icon: 'none'
        })
        return
      }
      
      this.socket.send({
        data: JSON.stringify(message)
      })
    },
    
    /**
     * 关闭连接
     */
    closeSocket() {
      if (this.socket) {
        this.socket.close()
        this.socket = null
        this.isConnected = false
      }
    }
  }
})