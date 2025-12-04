// mock/message.js

export const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// 私信列表数据
export const chatListData = [
  {
    id: 1,
    userId: 101,
    username: '小明同学',
    avatar: '/static/avatars/avatar1.png',
    lastMessage: '好的，那我们明天见！',
    time: '刚刚',
    unread: 2
  },
  {
    id: 2,
    userId: 102,
    username: '学姐小王',
    avatar: '/static/avatars/avatar2.png',
    lastMessage: '那本书我已经还到图书馆了',
    time: '10分钟前',
    unread: 0
  },
  {
    id: 3,
    userId: 103,
    username: '室友阿杰',
    avatar: '/static/avatars/avatar3.png',
    lastMessage: '今晚要不要一起吃饭？',
    time: '1小时前',
    unread: 1
  },
  {
    id: 4,
    userId: 104,
    username: '二手交易小哥',
    avatar: '/static/avatars/avatar4.png',
    lastMessage: '电脑还在吗？可以便宜点吗',
    time: '昨天',
    unread: 0
  }
];

// 赞评列表数据
export const notifyListData = [
  {
    id: 1,
    userId: 201,
    username: '0721高手',
    avatar: '/static/avatars/avatar5.png',
    type: 'reply',  // reply-回复, like-点赞
    typeText: '有新的回复',
    time: '13天前',
    content: '我是男生哇',
    quote: null,
    postId: 1001,
    isRead: false
  },
  {
    id: 2,
    userId: 202,
    username: '发嗲的石头',
    avatar: '/static/avatars/avatar6.png',
    type: 'like',
    typeText: '赞了你',
    time: '14天前',
    content: null,
    quote: '我我我，可出100，q: 849014041',
    postId: 1002,
    isRead: false
  },
  {
    id: 3,
    userId: 203,
    username: '冷静的乌冬面',
    avatar: '/static/avatars/avatar7.png',
    type: 'reply',
    typeText: '有新的回复',
    time: '14天前',
    content: '请问你找到了吗',
    quote: null,
    postId: 1003,
    isRead: true
  },
  {
    id: 4,
    userId: 204,
    username: '温婉的网络',
    avatar: '/static/avatars/avatar8.png',
    type: 'reply',
    typeText: '有新的回复',
    time: '15天前',
    content: '求求啦100也可以，来个人帮帮忙吧',
    quote: null,
    postId: 1004,
    isRead: true
  },
  {
    id: 5,
    userId: 205,
    username: '快乐小青蛙',
    avatar: '/static/avatars/avatar9.png',
    type: 'like',
    typeText: '赞了你',
    time: '15天前',
    content: null,
    quote: '今天天气真好，分享一下校园里的美景～',
    postId: 1005,
    isRead: true
  }
];