import Layout from '@/layout/Layout.vue';
import ParentView from '@/components/parentView/Index.vue';
import InnerLink from '@/components/innerLink/Index.vue';
import { getRoutes } from '@/api/menu.js';
import router from '@/router/index.js';

const state = {
  menus: [],
  routes: [],
  topNavRoutes: [],
};

const mutations = {
  SET_MENUS: (state, menus) => {
    state.menus = menus;
  },
  SET_ROUTES: (state, routes) => {
    state.routes = routes;
  },
  SET_TOP_NAV_ROUTES: (state, topNavRoutes) => {
    state.topNavRoutes = topNavRoutes;
  },
};

const actions = {
  GetRoutes: ({ commit }) => {
    return new Promise((resolve, reject) => {
      getRoutes()
        .then((res) => {
          const routes = JSON.parse(JSON.stringify(res.data));
          const copyRoutes = JSON.parse(JSON.stringify(res.data));
          const sidebarRoutes = filterAsyncRouter(routes);
          const copySidebarRoutes = filterAsyncRouter(copyRoutes);

          commit('SET_MENUS', sidebarRoutes);
          commit('SET_ROUTES', routes);
          commit('SET_TOP_NAV_ROUTES', copySidebarRoutes);

          sidebarRoutes.forEach((route) => {
            router.addRoute(route);
          });
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

const filterAsyncRouter = (asyncRouterMap, type = false) => {
  return asyncRouterMap.filter((route) => {
    if (type && route.children) {
      route.children = filterChildren(route.children);
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout;
      } else if (route.component === 'ParentView') {
        route.component = ParentView;
      } else if (route.component === 'InnerLink') {
        route.component = InnerLink;
      } else {
        route.component = loadView(route.component);
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type);
      let filter = route.children.filter((child) => {
        return child.path === '';
      });
      if (filter.length === 0) {
        route.redirect = { name: route.children[0].name };
      }
    } else {
      delete route['children'];
      delete route['redirect'];
    }
    return true;
  });
};

const filterChildren = (childrenMap, lastRoute = false) => {
  let children = [];
  childrenMap.forEach((el) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView') {
        el.children.forEach((child) => {
          child.path = el.path + '/' + child.path;
          if (child.children && child.children.length) {
            children = children.concat(filterChildren(child.children, child));
            return;
          }
          children.push(child);
        });
        return;
      }
    }
    if (lastRoute) {
      el.path = lastRoute.path + '/' + el.path;
    }
    children = children.concat(el);
  });
  return children;
};

const modules = import.meta.glob('/src/views/**/**.vue');

export const loadView = (view) => {
  let path = '/src/views/';
  if (new RegExp('^/views/.*$').test(view)) {
    path += view.replace(/^\/views\//, '');
  } else if (new RegExp('^views/.*$').test(view)) {
    path += view.replace(/^views\//, '');
  } else if (new RegExp('^@/views/.*$').test(view)) {
    path += view.replace(/^@\/views\//, '');
  } else {
    path += view;
  }
  if (!path.includes('Index')) {
    path += '/Index.vue';
  } else if (!path.includes('.vue')) {
    path += '.vue';
  }
  return modules[path];
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
