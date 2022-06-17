import request from '@/utils/request.js';

/**
 * 获取访问日志列表
 * @param params
 */
export function accessList(params) {
  return request.get('/manage/access/list', { params });
}

export function clear() {
  return request.delete('/manage/access/clear');
}
