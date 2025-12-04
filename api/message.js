// api/message.js

import { delay, chatListData, notifyListData } from '../mock/message.js';

const USE_MOCK = true;

/**
 * 获取私信列表
 */
export const getChatList = async () => {
  if (USE_MOCK) {
    await delay(200);
    const unreadCount = chatListData.reduce((sum, item) => sum + item.unread, 0);
    return { 
      code: 200, 
      data: { 
        list: chatListData,
        unreadCount 
      }, 
      message: 'success' 
    };
  }
};

/**
 * 获取赞评列表
 */
export const getNotifyList = async () => {
  if (USE_MOCK) {
    await delay(200);
    const unreadCount = notifyListData.filter(item => !item.isRead).length;
    return { 
      code: 200, 
      data: { 
        list: notifyListData,
        unreadCount 
      }, 
      message: 'success' 
    };
  }
};