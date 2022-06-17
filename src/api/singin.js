import request from '@/utils/request.js';

/**
 * 获取登录日志
 */
export function singinList(params) {
  return request.get('/manage/loginLog/list', { params });
}

/**
 * 清空登录日志
 */
export function clear() {
  return request.delete('/manage/loginLog/clear');
}

/**
 * 删除逐条日志
 */
export function deleted(data) {
  return request.delete('/manage/loginLog', { data });
}
