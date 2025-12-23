import request from '@/utils/request'
import mock from '@/mock/admin' // <--- 必须是默认引入

const USE_MOCK = true

const mockRequest = async (fn, ...args) => {
  try { return await fn(...args) } catch (e) { throw e }
}

export const adminApi = {
  // 7.1 获取待审核列表
  getReports(status = 'PENDING') {
    // 确保这里调用的是 mock.getReports
    if (USE_MOCK) return mockRequest(mock.getReports, { status })
    return request.get('/admin/reports', { status })
  },

  // 7.2 处理举报
  processReport(id, action, note = '') {
    const data = { action, note }
    // 确保这里调用的是 mock.processReport
    if (USE_MOCK) return mockRequest(mock.processReport, id, data)
    return request.post(`/admin/reports/${id}/process`, data)
  }
}