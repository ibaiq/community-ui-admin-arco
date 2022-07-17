import request from '@/utils/request.js';

/**
 * 获取路由信息
 */
export function getRoutes() {
  return request.get('/manage/menu/getRouters');
}

/**
 * 获取所有菜单
 */
export function menuList(params) {
  return request.get('/manage/menu/list', { params });
}

/**
 * 获取删除的菜单列表
 */
export function menuDelList(params) {
  return request.get('/manage/menu/delList', { params });
}

/**
 * 获取菜单完整信息
 */
export function getMenu(menuId) {
  return request.get(`/manage/menu/${menuId}`);
}

/**
 * 添加菜单
 */
export function addMenu(data) {
  return request.post('/manage/menu', data);
}

/**
 * 修改菜单
 */
export function modifyMenu(data) {
  return request.put('/manage/menu', data);
}
