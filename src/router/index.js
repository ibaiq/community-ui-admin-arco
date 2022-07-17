import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store/index.js';
import Nprogress from 'nprogress';
import { Base64 } from 'js-base64';
import { access, sentence } from '@/api/app.js';
import Layout from '@/layout/Layout.vue';

Nprogress.configure({ showSpinner: false });

export const routes = [
  {
    path: '/redirect',
    component: Layout,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/Index.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    hidden: true,
    component: () => import('@/views/login/Index_two.vue'),
    meta: { title: '请先登录' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const pathWhiteList = ['/login'];
const nameWhiteList = ['SystemError', 'NotFound'];

router.beforeEach((to, from, next) => {
  Nprogress.start();
  let suffix = 'Ibaiq管理系统';
  if (nameWhiteList.indexOf(to.name) !== -1) {
    suffix = to.meta.title;
  } else if (to.meta.title) {
    suffix = to.meta.title + ' - ' + suffix;
  }
  document.title = suffix;

  if (
    pathWhiteList.indexOf(to.path) === -1 &&
    nameWhiteList.indexOf(to.name) === -1
  ) {
    if (store.getters.token && store.getters.token.length > 0) {
      if (!store.getters.user) {
        store
          .dispatch('user/Profile')
          .then(() => {
            store
              .dispatch('menu/GetRoutes')
              .then(() => {
                if (to.matched.length === 0) {
                  router.addRoute({
                    path: '/:pathMatch(.*)*',
                    name: 'NotFound',
                    hidden: true,
                    component: () => import('@/views/error/NotFound'),
                    meta: { title: '页面不存在' },
                  });
                }
                sentence().then((res) => {
                  store.commit('app/SET_SENTENCE', res.data);
                });
                next({ ...to, replace: true });
              })
              .catch((err) => {
                systemError(err, next, to);
              });
          })
          .catch((err) => {
            systemError(err, next, to);
            // next(false);
          });
      } else {
        if (from.path.includes('/redirect')) {
          if (to.matched.length === 0) {
            router.addRoute({
              path: '/:pathMatch(.*)*',
              name: 'NotFound',
              hidden: true,
              component: () => import('@/views/error/NotFound'),
              meta: { title: '页面不存在' },
            });
            next({ ...to, replace: true });
          } else {
            next();
          }
        } else {
          next();
        }
      }
    } else {
      next({ path: '/login', query: { redirect: to.fullPath } });
    }
  } else {
    next();
  }
});

router.afterEach((to, from) => {
  store.commit('app/SET_HISTORY', from.fullPath);
  Nprogress.done();
  let data = {
    url: location.href.replace(/\/$/, ''),
    user: store.getters.user,
    token: store.getters.token,
  };
  let message = Base64.encode(JSON.stringify(data));
  access(message).then();
});

const systemError = (err, next, to) => {
  if (err.code === 401) {
    next(to.fullPath);
  } else if (
    err.message.includes('timeout') ||
    err.message.includes('Network Error')
  ) {
    router.addRoute({
      path: '/:pathMatch(.*)*',
      name: 'SystemError',
      hidden: true,
      component: () => import('@/views/error/SystemError'),
      meta: { title: '系统出错了' },
    });
    next({ ...to, replace: true });
  } else {
    next({ path: '/login', query: { redirect: to.fullPath } });
  }
};

export default router;
