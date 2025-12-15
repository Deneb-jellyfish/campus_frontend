<template>
  <view class="container">
    <!-- 顶部 Tabs -->
    <view class="tabs">
      <view 
        class="tab-item" 
        :class="{ active: currentType === 'published' }"
        @click="switchTab('published')"
      >
        我发布的
      </view>
      <view 
        class="tab-item" 
        :class="{ active: currentType === 'accepted' }"
        @click="switchTab('accepted')"
      >
        我帮送的
      </view>
    </view>

    <!-- 列表内容 -->
    <scroll-view scroll-y class="list-container">
      <view 
        v-for="item in list" 
        :key="item.id" 
        class="errand-item"
        @click="goToDetail(item.id)"
      >
        <view class="item-header">
          <text class="time">{{ formatDate(item.createTime) }}</text>
          <text class="status" :class="'s-'+item.status">{{ formatStatus(item.status) }}</text>
        </view>
        
        <view class="item-body">
          <view class="content">{{ item.content }}</view>
          <view class="route-line">
            <text class="dot pick">取</text> {{ item.pickupAddr }}
            <text class="arrow">→</text>
            <text class="dot send">送</text> {{ item.deliveryAddr }}
          </view>
        </view>
        
        <view class="item-footer">
          <view class="bounty">
            <template v-if="item.currency === 1">💰 {{ item.bounty }}</template>
            <template v-else>¥ {{ item.bounty }}</template>
          </view>
          <view class="btn check-btn">查看详情</view>
        </view>
      </view>
      
      <view v-if="list.length === 0" class="empty">暂无相关订单</view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { userApi } from '@/api/user'

const currentType = ref('published') // published | accepted
const list = ref([])

onMounted(() => {
  loadData()
})

const switchTab = (type) => {
  if (currentType.value === type) return
  currentType.value = type
  list.value = [] // 切换时先清空
  loadData()
}

const loadData = async () => {
  try {
    uni.showLoading({ title: '加载中' })
    const res = await userApi.getMyErrands(currentType.value)
    if (res.code === 200) {
      list.value = res.data.list
    }
  } finally {
    uni.hideLoading()
  }
}

const goToDetail = (id) => {
  uni.navigateTo({ url: `/pages/errand/detail?id=${id}` })
}

const formatStatus = (s) => ['待接单', '进行中', '已完成', '已取消'][s] || '未知'
const formatDate = (ts) => {
  const d = new Date(ts)
  return `${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`
}
</script>

<style scoped>
.container { min-height: 100vh; background: #F5F5F5; display: flex; flex-direction: column; }
.tabs { display: flex; background: #fff; padding: 20rpx 0; position: sticky; top: 0; z-index: 10; }
.tab-item { flex: 1; text-align: center; font-size: 30rpx; position: relative; padding-bottom: 20rpx; color: #666; }
.tab-item.active { color: #52C41A; font-weight: bold; }
.tab-item.active::after { content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 40rpx; height: 4rpx; background: #52C41A; border-radius: 2rpx; }

.list-container { flex: 1; padding: 20rpx; box-sizing: border-box; }
.errand-item { background: #fff; padding: 30rpx; border-radius: 16rpx; margin-bottom: 20rpx; }

.item-header { display: flex; justify-content: space-between; margin-bottom: 20rpx; font-size: 24rpx; }
.time { color: #999; }
.status { font-weight: bold; }
.s-0 { color: #faad14; } .s-1 { color: #1890FF; } .s-2 { color: #52C41A; } .s-3 { color: #999; }

.content { font-size: 30rpx; font-weight: bold; margin-bottom: 16rpx; }
.route-line { font-size: 26rpx; color: #666; display: flex; align-items: center; }
.dot { font-size: 20rpx; padding: 2rpx 8rpx; border-radius: 4rpx; color: #fff; margin-right: 8rpx; }
.dot.pick { background: #1890FF; }
.dot.send { background: #52C41A; }
.arrow { margin: 0 10rpx; color: #ccc; }

.item-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 20rpx; padding-top: 20rpx; border-top: 1rpx solid #f9f9f9; }
.bounty { font-size: 32rpx; color: #ff4d4f; font-weight: bold; }
.check-btn { font-size: 24rpx; border: 1rpx solid #ddd; padding: 8rpx 20rpx; border-radius: 30rpx; color: #666; }
.empty { text-align: center; color: #999; margin-top: 100rpx; }
</style>