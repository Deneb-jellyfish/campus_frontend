<template>
  <view class="admin-container">
    <!-- 1. 自定义头部 (深色商务风) -->
    <view class="custom-header admin-theme">
      <view class="status-bar"></view>
      <view class="nav-bar">
        <view class="back-btn" @click="goBack"><text class="back-arrow">←</text></view>
        <text class="page-title">内容审核工作台</text>
      </view>
    </view>

    <!-- 2. 列表区域 -->
    <view class="list-wrapper">
      <view v-for="item in list" :key="item.id" class="report-card">
        
        <!-- 举报基本信息 -->
        <view class="card-header">
          <view class="reason-tag">{{ item.reason }}</view>
          <text class="time">{{ formatDate(item.createTime) }}</text>
        </view>
        
        <!-- 举报详细描述 -->
        <view class="report-desc">
          <text class="label">举报描述：</text>
          <text class="value">{{ item.description }}</text>
        </view>
        
        <!-- 被举报的内容快照 (灰色背景区域) -->
        <view class="target-snapshot">
          <view class="snapshot-header">
            <text class="target-type">{{ item.targetType === 'POST' ? '帖子' : '评论' }}</text>
            <text class="author">发布者: {{ item.targetSnapshot.author.nickname }}</text>
          </view>
          <text class="content-preview">{{ item.targetSnapshot.content }}</text>
        </view>
        
        <!-- 3. 操作按钮组 -->
        <view class="action-bar">
          <button class="btn reject" @click="handleProcess(item, 'REJECT_REPORT')">
            驳回
          </button>
          <button class="btn delete" @click="handleProcess(item, 'DELETE_POST')">
            删除内容
          </button>
          <button class="btn ban" @click="handleProcess(item, 'BAN_USER')">
            封号
          </button>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-if="list.length === 0" class="empty">
        <text>🎉 暂无待审核内容</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { adminApi } from '@/api/admin'

const list = ref([])

onMounted(() => {
  loadData()
})

const goBack = () => uni.navigateBack()

const loadData = async () => {
  try {
    const res = await adminApi.getReports('PENDING')
    if (res.code === 200) {
      list.value = res.data.list
    }
  } catch (e) {
    console.error(e)
  }
}

// 处理举报的核心逻辑
const handleProcess = (item, action) => {
  let actionText = ''
  if (action === 'REJECT_REPORT') actionText = '驳回举报(无违规)'
  if (action === 'DELETE_POST') actionText = '确认删除该内容'
  if (action === 'BAN_USER') actionText = '确认封禁该用户'

  // 弹窗输入处理备注
  uni.showModal({
    title: '审核处理',
    content: actionText,
    editable: true, // 允许输入备注
    placeholderText: '请输入处理理由/备注',
    success: async (res) => {
      if (res.confirm) {
        const note = res.content || '管理员操作'
        try {
          uni.showLoading({ title: '处理中' })
          await adminApi.processReport(item.id, action, note)
          uni.showToast({ title: '处理完成' })
          // 移除本地列表项
          list.value = list.value.filter(i => i.id !== item.id)
        } catch (error) {
          uni.showToast({ title: '操作失败', icon: 'none' })
        } finally {
          uni.hideLoading()
        }
      }
    }
  })
}

const formatDate = (ts) => {
  const d = new Date(ts)
  return `${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`
}
</script>

<style scoped>
.admin-container { min-height: 100vh; background: #f0f2f5; }

/* 头部样式 */
.custom-header { position: fixed; top: 0; width: 100%; z-index: 100; }
.admin-theme { 
  background: #37474F; /* 深蓝灰色，代表管理后台 */
  color: #fff;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.2);
}
.status-bar { height: var(--status-bar-height); }
.nav-bar { height: 88rpx; display: flex; align-items: center; padding: 0 30rpx; }
.back-arrow { font-size: 40rpx; color: #fff; font-weight: bold; padding: 10rpx; margin-left: -10rpx;}
.page-title { flex: 1; text-align: center; font-size: 34rpx; font-weight: bold; margin-right: 40rpx; }

/* 列表容器 */
.list-wrapper { padding: 30rpx; padding-top: calc(var(--status-bar-height) + 118rpx); }

/* 举报卡片 */
.report-card { background: #fff; border-radius: 16rpx; padding: 30rpx; margin-bottom: 30rpx; box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05); }

.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20rpx; }
.reason-tag { background: #FFF2F0; color: #FF4D4F; padding: 4rpx 16rpx; border-radius: 8rpx; font-size: 26rpx; font-weight: bold; border: 1rpx solid #FFCCC7; }
.time { color: #999; font-size: 24rpx; }

.report-desc { margin-bottom: 20rpx; font-size: 28rpx; color: #666; }
.label { font-weight: bold; color: #333; }

/* 快照区域 */
.target-snapshot { background: #F5F7FA; padding: 20rpx; border-radius: 8rpx; margin-bottom: 30rpx; border-left: 6rpx solid #37474F; }
.snapshot-header { display: flex; justify-content: space-between; margin-bottom: 10rpx; font-size: 24rpx; color: #999; }
.content-preview { font-size: 28rpx; color: #333; line-height: 1.5; font-weight: bold; }

/* 按钮组 */
.action-bar { display: flex; justify-content: flex-end; gap: 20rpx; border-top: 1rpx solid #eee; padding-top: 20rpx; }
.btn { margin: 0; font-size: 26rpx; height: 60rpx; line-height: 60rpx; border-radius: 30rpx; padding: 0 30rpx; }
.btn.reject { background: #f5f5f5; color: #666; border: 1rpx solid #ddd; }
.btn.delete { background: #FFE58F; color: #D48806; }
.btn.ban { background: #FF4D4F; color: #fff; }

.empty { text-align: center; margin-top: 100rpx; color: #999; }
</style>