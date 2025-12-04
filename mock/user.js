// mock/user.js
// 模拟简单的内存数据库
let userInfo = {
  id: 1001,
  username: "student2024",
  nickname: "小明",
  avatarUrl: "", // 空字符串测试默认头像
  school: "计算机学院",
  points: 120,
  bio: "好好学习，天天向上",
  checkedIn: false // 模拟签到状态
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export default {
  // 模拟登录
  async login(data) {
    await delay(500)
    if (data.username === 'student2024' && data.password === '123456') {
      return {
        code: 200,
        data: { token: "MockToken123", user: userInfo }
      }
    }
    throw { code: 400, message: '用户名或密码错误' }
  },

  // 模拟获取信息
  async getUserInfo() {
    await delay(300)
    return { code: 200, data: userInfo }
  },

  // 模拟我的帖子
  async getMyPosts() {
    await delay(300)
    return {
      code: 200,
      data: {
        list: [
          { id: 1, content: "这是我发布的第一条帖子，校园里的猫真可爱 #猫咪", createTime: Date.now(), stats: { views: 120 } },
          { id: 2, content: "期末考试求复习资料", createTime: Date.now(), stats: { views: 45 } }
        ]
      }
    }
  },

  // 3.6 获取签到状态
  async getCheckInStatus() {
    await delay(200)
    return {
      code: 200,
      data: { checkedIn: userInfo.checkedIn, checkInDays: 5 }
    }
  },

  // 3.7 签到动作
  async checkIn() {
    await delay(500)
    if (userInfo.checkedIn) {
      throw { code: 400, message: '今天已经签过到了' }
    }
    // 更新数据
    userInfo.checkedIn = true
    userInfo.points += 10
    
    return {
      code: 200,
      message: '签到成功 +10积分',
      data: { points: 10, totalPoints: userInfo.points }
    }
  },
  // 3.2 更新个人资料
    async updateProfile(params) {
      await delay(800)
      // 更新内存中的用户信息
      if (params.nickname) userInfo.nickname = params.nickname
      if (params.bio) userInfo.bio = params.bio
      if (params.avatarUrl) userInfo.avatarUrl = params.avatarUrl
      if (params.school) userInfo.school = params.school
      
      return {
        code: 200,
        message: '保存成功',
        data: userInfo // 返回最新的用户信息
      }
    },
    
    // 补充: 获取我的跑腿
    async getMyErrands(params) {
      await delay(500)
      const type = params.type || 'published'
      return {
        code: 200,
        data: {
          list: [
            {
              id: type === 'published' ? 201 : 301,
              content: type === 'published' ? "求带一份黄焖鸡米饭到C楼" : "帮同学取了快递",
              status: type === 'published' ? 0 : 2, // 0待接单, 2已完成
              bounty: 5.00,
              createTime: Date.now()
            }
          ]
        }
      }
    }
}