// mock/admin.js
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// 模拟数据
let reports = [
  {
    id: 1,
    targetType: 'POST',
    targetId: 101,
    reason: '垃圾广告',
    description: '一直在发兼职刷单的广告，请处理',
    createTime: Date.now() - 3600000,
    reporter: { nickname: '热心同学A', id: 201 },
    targetSnapshot: {
      content: '诚招刷单，日入300+，加V：wx123456',
      images: [],
      author: { nickname: '兼职代理', id: 999 }
    }
  },
  {
    id: 2,
    targetType: 'COMMENT',
    targetId: 505,
    reason: '辱骂攻击',
    description: '在评论区骂人，很难听',
    createTime: Date.now() - 7200000,
    reporter: { nickname: '受委屈的B', id: 202 },
    targetSnapshot: {
      content: '你就是个***，长得丑还出来吓人',
      author: { nickname: '键盘侠', id: 888 }
    }
  }
]

// 关键修复：必须有 export default
export default {
  // 7.1 获取待审核列表
  async getReports(params) {
    await delay(500)
    return {
      code: 200,
      data: {
        list: reports,
        total: reports.length
      }
    }
  },

  // 7.2 处理举报
  async processReport(id, data) {
    await delay(800)
    const index = reports.findIndex(r => r.id == id)
    if (index !== -1) {
      reports.splice(index, 1)
    }
    
    console.log(`[Mock Admin] 处理举报 ${id}, 动作: ${data.action}, 备注: ${data.note}`)
    
    return {
      code: 200,
      message: '处理成功'
    }
  }
}