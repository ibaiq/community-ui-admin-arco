import axios from 'axios';
import store from '@/store/index.js';
import { Message } from '@arco-design/web-vue';
import { remove } from '@/utils/auth.js';
import router from '@/router/index.js';

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000,
});

service.interceptors.request.use(
  (config) => {
    let isNotToken = config.headers.isNotToken;
    if (!isNotToken && store.getters.token) {
      config.headers.Authorization = `Bearer ${store.getters.token}`;
      // config.headers.AcceptLanguage = store.getters.language;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (success) => {
    if (success.headers.refreshtoken !== undefined) {
      localStorage.setItem('Authorization', success.headers.refreshtoken);
    }
    return success.data;
  },
  (error) => {
    let { message, config } = error;
    let isMessage = config.headers.notShowMessage;
    if (!isMessage && axios.isCancel(error)) {
      Message.warning({
        id: 'isCancel',
        content: '请勿重复请求',
      });
    }
    if (!isMessage && message.includes('timeout')) {
      // error.response.data.msg = "接口请求连接超时";
      Message.warning({
        id: 'timeout',
        content: '接口请求连接超时',
      });
    } else if (!isMessage && message === 'Network Error') {
      // error.response.data.msg = "后端接口连接异常";
      Message.error({
        id: 'Network Error',
        content: '后端接口连接异常',
      });
    }
    if (error.response !== undefined) {
      if (error.response.status === 401) {
        remove();
        store.commit('user/SET_TOKEN', undefined);
        store.commit('user/SET_USER', undefined);
        router
          .replace({
            path: '/login',
            query: { redirect: router.currentRoute.value.fullPath },
          })
          .then()
          .catch();
        if (!isMessage) {
          Message.error({
            id: '401',
            content: error.response.data.msg,
          });
        }
      } else if (
        (!isMessage && error.response.status === 500) ||
        error.response.status === 400 ||
        error.response.status === 404
      ) {
        Message.error({
          id: '400',
          content: error.response.data.msg || '服务器开小差了~',
        });
      } else if (!isMessage && error.response.status === 403) {
        Message.warning({
          id: '403',
          content: error.response.data.msg,
        });
      } else if (!isMessage && error.response.status === 405) {
        Message.warning({
          id: '405',
          content: error.response.data.msg,
        });
      }
      return Promise.reject(error.response.data);
    }
    // else {
    //   let config = error.config;
    //   if (!config) return Promise.reject(error);
    //   const { __retryCount = 0, retryDelay = 300 } = config;
    //   // 在请求对象上设置重试次数
    //   config.__retryCount = __retryCount;
    //   // 判断是否超过了重试次数
    //   if (__retryCount >= 2) {
    //     return Promise.reject(error);
    //   }
    //   // 增加重试次数
    //   config.__retryCount++;
    //   // 延时处理
    //   const delay = new Promise((resolve) => {
    //     setTimeout(() => {
    //       resolve();
    //     }, retryDelay);
    //   });
    //   // 重新发起请求
    //   return delay.then(function () {
    //     return service(config);
    //   });
    // }
  }
);

export default service;
