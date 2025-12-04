<!-- pages/login/index.vue -->
<template>
  <view class="login-container">
    <view class="header">
      <text class="title">欢迎来到码住校园</text>
      <text class="sub-title">登录后体验更多精彩功能</text>
    </view>

    <view class="form-box">
      <!-- 账号输入 -->
      <view class="input-item">
        <text class="label">账号</text>
        <input 
          class="input" 
          v-model="form.username" 
          placeholder="请输入学号/手机号" 
        />
      </view>
      
      <!-- 密码输入 -->
      <view class="input-item">
        <text class="label">密码</text>
        <input 
          class="input" 
          v-model="form.password" 
          password 
          placeholder="请输入密码" 
        />
      </view>

      <button class="submit-btn" :loading="loading" @click="handleLogin">
        立即登录
      </button>

      <view class="actions">
        <text class="link">忘记密码?</text>
        <text class="link" @click="toggleMode">没有账号? 去注册</text>
      </view>
    </view>
    
    <!-- 快捷测试提示 -->
    <view class="dev-tip">
      测试账号: student2024 / 123456
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { userApi } from '@/api/user'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const loading = ref(false)

const form = reactive({
  username: '',
  password: ''
})

const handleLogin = async () => {
  if (!form.username || !form.password) {
    return uni.showToast({ title: '请输入账号密码', icon: 'none' })
  }

  loading.value = true
  try {
    // 调用 Mock API
    const res = await userApi.login(form)
    
    if (res.code === 200) {
      // 存入 Pinia 和 Storage
      userStore.setLoginState(res.data)
      
      uni.showToast({ title: '登录成功' })
      
      // 延迟返回，让用户看到提示
      setTimeout(() => {
        uni.navigateBack()
      }, 1000)
    }
  } catch (error) {
    uni.showToast({ 
      title: error.message || '登录失败', 
      icon: 'none' 
    })
  } finally {
    loading.value = false
  }
}

const toggleMode = () => {
  uni.showToast({ title: '注册功能请查看API文档 U01', icon: 'none' })
}
</script>

<style scoped>
.login-container {
  padding: 60rpx;
  min-height: 100vh;
  background: #fff;
}
.header { margin-top: 100rpx; margin-bottom: 80rpx; }
.title { font-size: 48rpx; font-weight: bold; display: block; margin-bottom: 20rpx; }
.sub-title { font-size: 28rpx; color: #999; }

.input-item { margin-bottom: 40rpx; border-bottom: 1rpx solid #eee; padding-bottom: 10rpx; }
.label { font-size: 28rpx; color: #333; margin-bottom: 10rpx; display: block; font-weight: bold; }
.input { height: 80rpx; font-size: 32rpx; }

.submit-btn {
  background: #52C41A; color: #fff; border-radius: 50rpx; 
  margin-top: 60rpx; font-size: 32rpx; font-weight: bold;
}
.submit-btn:active { opacity: 0.9; }

.actions { display: flex; justify-content: space-between; margin-top: 30rpx; font-size: 26rpx; color: #666; }

.dev-tip { margin-top: 100rpx; text-align: center; color: #ccc; font-size: 24rpx; }
</style>