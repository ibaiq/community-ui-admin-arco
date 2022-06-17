import request from '@/utils/request.js';

/**
 * 获取角色列表
 */
export function roleList(params) {
  return request.get('/manage/role/pagination', {
    params,
  });
}

/**
 * 获取一条角色信息
 */
export function getRole(roleId) {
  return request.get(`/manage/role/${roleId}`);
}

/**
 * 获取角色授权的用户
 */
export function getRoleAuthUser(roleId) {
  return request.get(`/manage/role/authorize/authorizeList/${roleId}`);
}

/**
 * 添加角色
 */
export function addRole(data) {
  return request.post('/manage/role', data);
}

/**
 * 修改角色
 */
export function modifyRole(data) {
  return request.put('/manage/role', data);
}

/**
 * 删除角色
 */
export function deleteRole(roleIds) {
  return request.delete('/manage/role', { data: roleIds });
}

/**
 * 获取角色下分配的权限菜单id列表
 */
export function getRoleMenuList(roleId) {
  return request.get(`/manage/role/menuTreeList/${roleId}`);
}

/**
 * 权限分配
 */
export function selectMenu(roleId, menuIds) {
  return request.put(`/manage/role/selectMenu/${roleId}`, menuIds);
}

/**
 * 获取所有角色
 */
export function getRoleList() {
  return request.get('/manage/role/list');
}
