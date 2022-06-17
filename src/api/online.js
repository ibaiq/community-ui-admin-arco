import request from '@/utils/request.js';

/**
 * 获取在线用户
 * @param params 参数
 */
export function onlineList(params) {
  return request.get('/manage/online/list', { params });
}

/**
 * 强制退出某用户
 * @param uuid
 */
export function retreat(uuid) {
  return request.delete(`/manage/online/${uuid}`);
}
