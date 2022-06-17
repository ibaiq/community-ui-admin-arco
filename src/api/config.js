import request from '@/utils/request.js';

/**
 * 获取系统配置
 */
export function getConfValue(key) {
  return request.get(`/manage/config/value/${key}`);
}

/**
 * 获取所有系统配置
 */
export function configList(params) {
  return request.get('/manage/config/list', { params });
}
