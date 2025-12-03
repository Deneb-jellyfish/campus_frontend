// mock/index.js - Mock 数据中心
// 安装：npm install better-mock --save-dev

import Mock from 'better-mock'

// 用户头像列表
const avatars = [
  'https://picsum.photos/200/200?random=1',
  'https://picsum.photos/200/200?random=2',
  'https://picsum.photos/200/200?random=3',
  'https://picsum.photos/200/200?random=4',
  'https://picsum.photos/200/200?random=5'
]

// 帖子图片列表
const postImages = [
  'https://picsum.photos/400/600?random=1',
  'https://picsum.photos/400/500?random=2',
  'https://picsum.photos/400/700?random=3',
  'https://picsum.photos/400/400?random=4',
  'https://picsum.photos/400/800?random=5'
]

// 帖子内容模板
const postContents = [
  '出一台笔记本电脑自用的可以流畅打灯打cf,换台式了所以不用了,爽快来,980买不了了...',
  '今天天气真好，校园里的樱花开了，拍了几张照片分享给大家~',
  '有没有人一起去图书馆自习的？求组队！',
  '食堂新出的炸鸡超好吃！强烈推荐！',
  '求助：明天有计算机考试，有没有大神可以帮忙讲解一下重点？',
  '周末组织爬山活动，有兴趣的小伙伴可以报名啦~',
  '分享一个学习网站，对期末复习很有帮助！',
  '出闲置自行车一辆，9成新，价格美丽！',
  '今天在操场看到了好美的晚霞，分享给大家！',
  '有人想养猫吗？朋友家的猫生了好多小猫，可爱极了！'
]

// 用户昵称模板
const nicknames = [
  '黄灯泡绿灯炮',
  '阳光少年',
  '学习小能手',
  '代码搬运工',
  '校园达人',
  '甜品爱好者',
  '运动健将',
  '摄影师',
  '音乐发烧友',
  '旅行者'
]

// 标签列表
const tags = ['闲置', '求助', '日常', '美食', '学习', '运动', '摄影', '旅行']

// ==================== 用户相关 ====================

// 登录接口
Mock.mock('/api/user/login', 'post', (options) => {
  const body = JSON.parse(options.body)
  
  return {
    code: 0,
    message: '登录成功',
    data: {
      token: Mock.Random.guid(),
      userInfo: {
        id: Mock.Random.id(),
        nickname: body.username || '新用户',
        avatar: Mock.Random.pick(avatars),
        school: '浙江大学城市学院',
        signature: '这个人很懒，什么都没留下~'
      }
    }
  }
})

// 获取用户信息
Mock.mock('/api/user/info', 'get', {
  code: 0,
  message: '获取成功',
  data: {
    id: '@id',
    nickname: '@cname',
    avatar: () => Mock.Random.pick(avatars),
    school: '浙江大学城市学院',
    signature: '@csentence',
    followCount: '@integer(100, 10000)',
    fansCount: '@integer(100, 10000)',
    likeCount: '@integer(1000, 100000)'
  }
})

// ==================== 帖子相关 ====================

// 获取帖子列表
Mock.mock(RegExp('/api/post/list.*'), 'get', (options) => {
  // 解析查询参数
  const url = options.url
  const params = new URLSearchParams(url.split('?')[1])
  const page = parseInt(params.get('page') || '1')
  const pageSize = parseInt(params.get('pageSize') || '10')
  
  // 生成帖子列表
  const list = []
  for (let i = 0; i < pageSize; i++) {
    const imageCount = Mock.Random.integer(1, 4)
    const images = []
    
    for (let j = 0; j < imageCount; j++) {
      images.push({
        url: Mock.Random.pick(postImages),
        width: Mock.Random.integer(400, 800),
        height: Mock.Random.integer(400, 1000)
      })
    }
    
    // 随机决定是否是闲置帖子
    const isGoods = Mock.Random.boolean()
    
    list.push({
      id: Mock.Random.id(),
      content: Mock.Random.pick(postContents),
      images: images,
      tag: Mock.Random.pick(tags),
      type: Mock.Random.pick(['image', 'video']),
      price: isGoods ? Mock.Random.integer(50, 1000) : null,
      userId: Mock.Random.id(),
      userName: Mock.Random.pick(nicknames),
      userAvatar: Mock.Random.pick(avatars),
      userLevel: Mock.Random.integer(1, 5),
      viewCount: Mock.Random.integer(100, 50000),
      likeCount: Mock.Random.integer(10, 5000),
      commentCount: Mock.Random.integer(0, 500),
      collectCount: Mock.Random.integer(5, 1000),
      isLiked: Mock.Random.boolean(),
      isCollected: Mock.Random.boolean(),
      createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
    })
  }
  
  return {
    code: 0,
    message: '获取成功',
    data: {
      list: list,
      total: 100,
      page: page,
      pageSize: pageSize,
      hasMore: page < 10
    }
  }
})

// 获取帖子详情
Mock.mock(RegExp('/api/post/\\d+'), 'get', {
  code: 0,
  message: '获取成功',
  data: {
    id: '@id',
    content: () => Mock.Random.pick(postContents),
    'images|1-4': [{
      url: () => Mock.Random.pick(postImages),
      width: '@integer(400, 800)',
      height: '@integer(400, 1000)'
    }],
    tag: () => Mock.Random.pick(tags),
    userId: '@id',
    userName: () => Mock.Random.pick(nicknames),
    userAvatar: () => Mock.Random.pick(avatars),
    viewCount: '@integer(100, 50000)',
    likeCount: '@integer(10, 5000)',
    commentCount: '@integer(0, 500)',
    collectCount: '@integer(5, 1000)',
    isLiked: '@boolean',
    isCollected: '@boolean',
    createTime: '@datetime("yyyy-MM-dd HH:mm:ss")'
  }
})

// 点赞/取消点赞
Mock.mock(RegExp('/api/post/\\d+/like'), 'post', {
  code: 0,
  message: '操作成功',
  data: {
    isLiked: '@boolean'
  }
})

// ==================== 评论相关 ====================

// 获取评论列表
Mock.mock(RegExp('/api/comment/\\d+'), 'get', {
  code: 0,
  message: '获取成功',
  data: {
    'list|10-20': [{
      id: '@id',
      content: '@csentence(10, 50)',
      userId: '@id',
      userName: () => Mock.Random.pick(nicknames),
      userAvatar: () => Mock.Random.pick(avatars),
      likeCount: '@integer(0, 100)',
      isLiked: '@boolean',
      createTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
      'replyList|0-3': [{
        id: '@id',
        content: '@csentence(5, 30)',
        userId: '@id',
        userName: () => Mock.Random.pick(nicknames),
        userAvatar: () => Mock.Random.pick(avatars),
        replyToUserName: () => Mock.Random.pick(nicknames),
        createTime: '@datetime("yyyy-MM-dd HH:mm:ss")'
      }]
    }],
    total: '@integer(10, 100)',
    hasMore: '@boolean'
  }
})

// 发表评论
Mock.mock('/api/comment/add', 'post', {
  code: 0,
  message: '评论成功',
  data: {
    id: '@id',
    content: '@csentence',
    createTime: '@now'
  }
})

// ==================== 聊天相关 ====================

// 获取会话列表
Mock.mock('/api/chat/conversation/list', 'get', {
  code: 0,
  message: '获取成功',
  data: {
    'list|5-10': [{
      id: '@id',
      otherUserId: '@id',
      otherUserName: () => Mock.Random.pick(nicknames),
      otherUserAvatar: () => Mock.Random.pick(avatars),
      lastMessage: '@csentence(5, 20)',
      lastTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
      'unreadCount|0-10': 1
    }]
  }
})

// 获取聊天记录
Mock.mock(RegExp('/api/chat/history/.*'), 'get', {
  code: 0,
  message: '获取成功',
  data: {
    'list|10-20': [{
      id: '@id',
      type: () => Mock.Random.pick(['text', 'image', 'voice']),
      content: '@csentence(5, 30)',
      fromUserId: '@id',
      toUserId: '@id',
      createTime: '@datetime("yyyy-MM-dd HH:mm:ss")'
    }],
    hasMore: '@boolean'
  }
})

// ==================== 话题相关 ====================

// 获取热门话题
Mock.mock('/api/topic/hot', 'get', {
  code: 0,
  message: '获取成功',
  data: {
    'list|5-10': [{
      id: '@id',
      name: '@ctitle(3, 8)',
      cover: () => Mock.Random.pick(postImages),
      'postCount|1000-100000': 1,
      'participantCount|100-10000': 1
    }]
  }
})

// ==================== 上传相关 ====================

// 上传图片/视频
Mock.mock('/api/upload', 'post', {
  code: 0,
  message: '上传成功',
  data: {
    url: () => Mock.Random.pick(postImages),
    width: '@integer(400, 800)',
    height: '@integer(400, 1000)'
  }
})

console.log('Mock 数据服务已启动')

export default Mock