<!-- pages/profile/edit.vue -->
<template>
  <view class="edit-container">
    <view class="form-list">
      <!-- 头像行 -->
      <view class="form-item avatar-row" @click="handleChooseAvatar">
        <text class="label">头像</text>
        <view class="right">
          <image 
            :src="form.avatarUrl || '../../static/default-avatar.png'" 
            class="avatar-preview" 
            mode="aspectFill"
          />
          <text class="arrow">></text>
        </view>
      </view>

      <!-- 昵称 -->
      <view class="form-item">
        <text class="label">昵称</text>
        <input class="input" v-model="form.nickname" placeholder="请输入昵称" />
      </view>

      <!-- 学院 -->
      <view class="form-item">
        <text class="label">学院</text>
        <input class="input" v-model="form.school" placeholder="例如：计算机学院" />
      </view>

      <!-- 签名 -->
      <view class="form-item">
        <text class="label">个性签名</text>
        <input class="input" v-model="form.bio" placeholder="介绍一下自己吧" />
      </view>
    </view>

    <button class="save-btn" @click="handleSave" :loading="loading">保存修改</button>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { userApi } from '@/api/user'
import { commonApi } from '@/api/common'

const userStore = useUserStore()
const loading = ref(false)

// 表单数据初始化
const form = reactive({
  avatarUrl: '',
  nickname: '',
  school: '',
  bio: ''
})

onMounted(() => {
  // 回显当前数据
  const info = userStore.userInfo
  if (info) {
    form.avatarUrl = info.avatarUrl
    form.nickname = info.nickname
    form.school = info.school
    form.bio = info.bio
  }
})

// 选择并上传头像
const handleChooseAvatar = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    success: async (res) => {
      const tempFilePath = res.tempFilePaths[0]
      // 先在本地显示预览（优化体验）
      form.avatarUrl = tempFilePath
      
      try {
        uni.showLoading({ title: '上传中...' })
        // 调用上传 API
        const uploadRes = await commonApi.uploadImage(tempFilePath)
        if (uploadRes.code === 200) {
          form.avatarUrl = uploadRes.data.url
        }
      } catch (error) {
        uni.showToast({ title: '上传失败', icon: 'none' })
      } finally {
        uni.hideLoading()
      }
    }
  })
}

// 保存资料
const handleSave = async () => {
  if (!form.nickname) return uni.showToast({ title: '昵称不能为空', icon: 'none' })
  
  loading.value = true
  try {
    const payload = {
      avatarUrl: (form.avatarUrl || '').trim(),
      nickname: (form.nickname || '').trim(),
      school: (form.school || '').trim(),
      bio: (form.bio || '').trim()
    }
    const res = await userApi.updateProfile(payload)
    if (res.code === 200) {
      // 更新 Store（以服务端为准）
      const infoRes = await userApi.getUserInfo()
      if (infoRes.code === 200) {
        userStore.updateUserInfo(infoRes.data)
      } else {
        userStore.updateUserInfo(res.data)
      }
      uni.showToast({ title: '保存成功' })
      setTimeout(() => uni.navigateBack(), 1000)
    }
  } catch (error) {
    uni.showToast({ title: '保存失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.edit-container { min-height: 100vh; background: #F5F5F5; padding-top: 20rpx; }
.form-list { background: #fff; padding: 0 30rpx; }
.form-item {
  display: flex; justify-content: space-between; align-items: center;
  padding: 30rpx 0; border-bottom: 1rpx solid #eee;
}
.label { font-size: 30rpx; color: #333; width: 160rpx; }
.input { flex: 1; text-align: right; font-size: 30rpx; color: #333; }
.right { display: flex; align-items: center; }
.avatar-preview { width: 100rpx; height: 100rpx; border-radius: 50%; margin-right: 20rpx; background: #eee; }
.arrow { color: #ccc; }
.save-btn {
  margin: 60rpx 30rpx; background: #52C41A; color: #fff; 
  border-radius: 40rpx; font-size: 32rpx;
}
</style>
