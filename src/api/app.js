import request from '@/utils/request.js';
import store from '@/store/index.js';

/**
 * 向后端写入用户访问那些前端页面以及数据
 * 存储访问日志
 */
export async function access(data) {
  await request.post('/access', undefined, {
    headers: {
      Access: data,
      notShowMessage: true,
    },
  });
}

/**
 * 每日一句
 */
export async function sentence() {
  return request.get('/sentence');
}

/**
 * 阿里图标
 */
export async function alibabaIcon() {
  let split = store.state.app.iconPath.split('/');
  return request.get(`/alibaba/${split[3]}/${split[4]}on`);
}
