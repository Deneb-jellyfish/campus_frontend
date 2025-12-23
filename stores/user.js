// stores/user.js - 用户状态管理 (Pinia)

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userApi } from '@/api/user' // 引入 API

// 注意：getToken, setToken, removeToken 不再直接从 '@/utils/request' 导入
// 而是为了避免循环依赖，直接在 store 内部使用 uni.getStorageSync 等原生方法
// 或者可以在单独的 localstorage.js 文件中封装

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref(uni.getStorageSync('token') || '')
  // userInfo 初始化时加入默认的 stats 和 role 结构
  const userInfo = ref(uni.getStorageSync('userInfo') || {
    id: null,
    username: '',
    nickname: '未登录',
    avatarUrl: '', // 与后端字段保持一致
    school: '',
    points: 0,
    bio: '',
    role: 'USER', // 默认用户角色
    stats: { // 用户统计数据
      followers: 0,
      following: 0,
      likes: 0 // 如果后端有返回
    }
  })

  // 计算属性
  const isLoggedIn = computed(() => !!token.value)
  const avatar = computed(() => userInfo.value?.avatarUrl || '../../static/default-avatar.png')
  const nickname = computed(() => userInfo.value?.nickname || '未登录用户')

  // 动作：登录成功处理 (U02)
  const setLoginState = (loginData) => {
    token.value = loginData.token
    // 登录时后端返回的 user 信息可能不完整，只更新已有的字段
    userInfo.value = { 
        ...userInfo.value, 
        id: loginData.user.id,
        nickname: loginData.user.nickname,
        points: loginData.user.points,
        // 其他字段如 avatarUrl, school, bio, role 可能在 getUserInfo 后补充
    }
    
    // 持久化存储
    uni.setStorageSync('token', loginData.token)
    uni.setStorageSync('userInfo', userInfo.value) // 存储更新后的 userInfo
  }

  // 动作：更新用户信息 (U03)
  const updateUserInfo = (newInfo) => {
    // 深度合并 userInfo，尤其是 stats 对象
    userInfo.value = { 
        ...userInfo.value, 
        ...newInfo,
        stats: {
            ...userInfo.value.stats, // 保留现有 stats
            ...newInfo.stats         // 合并新 stats
        }
    }
    uni.setStorageSync('userInfo', userInfo.value)
  }

  // 动作：退出登录 (U05)
  const logout = async () => {
    try {
      // 1. 调用后端接口 (如果后端需要 token，请求封装中会自动带上)
      if (token.value) {
        await userApi.logout()
      }
    } catch (e) {
      console.warn('退出接口调用失败，但这不影响前端清除状态', e)
    } finally {
      // 2. 无论后端成功与否，前端必须清除状态
      token.value = ''
      // 重置 userInfo 到初始状态
      userInfo.value = {
        id: null,
        username: '',
        nickname: '未登录',
        avatarUrl: '',
        school: '',
        points: 0,
        bio: '',
        role: 'USER',
        stats: {
          followers: 0,
          following: 0,
          likes: 0
        }
      }
      uni.removeStorageSync('token')
      uni.removeStorageSync('userInfo')
    }
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    avatar,
    nickname,
    setLoginState,
    updateUserInfo,
    logout
  }
})