import request from '@/utils/request.js';
import qs from 'qs';

/**
 * 获取个人信息
 */
export function profile() {
  return request.get('/user/profile');
}

/**
 * 登录
 */
export function login(user) {
  return request.post('/login', qs.stringify(user), {
    headers: {
      isNorToken: true,
    },
  });
}

/**
 * 注销登录
 */
export function logout() {
  return request.post('/logout');
}

/**
 * 获取用户信息列表
 */
export function userList(params) {
  return request.get('/manage/user/pagination', {
    params,
  });
}

/**
 * 修改用户状态
 */
export function modifyStatus(userId, status) {
  return request.put(`/manage/user/${userId}/${status}`);
}

/**
 * 获取单个用户信息
 */
export function getUser(userId) {
  return request.get(`/manage/user/${userId}`);
}

/**
 * 修改用户信息
 */
export function modify(user) {
  return request.put('/manage/user', user);
}

/**
 * 删除用户
 */
export function delUser(userIds) {
  return request.delete('/manage/user', {
    data: userIds,
  });
}

/**
 * 添加用户
 */
export function addUser(data) {
  return request.post('/manage/user', data);
}

/**
 * 重置密码
 */
export function resetPwd(data) {
  return request.put('/manage/user/resetPwd', data);
}

/**
 *  获取本站用户数量
 */
export const getUserCount = () => {
  return request.get('/manage/user/getCount');
};

/**
 * 获取删除用户列表
 * @param params
 */
export const getDelList = (params) => {
  return request.get('/manage/user/getDelUser', {
    params,
  });
};

/**
 * 恢复已删除用户
 */
export function revertUser(userIds) {
  return request.post('/manage/user/recover', userIds);
}

/**
 * 授权用户角色
 */
export function authUserRole(userId, roleIds) {
  return request.put(`/manage/user/authorize/${userId}`, roleIds);
}
