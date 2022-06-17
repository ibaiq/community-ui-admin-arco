import router from '@/router/index.js';
import store from '@/store/index.js';

const state = {
  cachedViews: ['ParentView'],
  visitedViews: JSON.parse(sessionStorage.getItem('indexTabs')) || [
    { path: '/', title: '首页' },
  ],
};

const mutations = {
  ADD_CACHED_VIEW: (state, view) => {
    if (state.cachedViews.includes(view.name)) return;
    if (!view.meta.noCache && view.name) {
      state.cachedViews.push(view.name);
    }
  },
  DEL_CACHED_VIEW: (state, view) => {
    const index = state.cachedViews.indexOf(view.name);
    index > -1 && state.cachedViews.splice(index, 1);
  },
  ADD_VISITED_VIEW: (state, view) => {
    if (view.path === '/login') return;
    if (state.visitedViews.some((v) => v.path === view.path)) return;
    if (view.path !== '/') {
      if (view.name === 'User-auth-role') {
        let isExist = state.visitedViews.some((v) => v.name === view.name);
        if (isExist) {
          let index = state.visitedViews.findIndex((v) => v.name === view.name);
          state.visitedViews.splice(
            index === -1 ? state.visitedViews.length - 1 : index,
            1,
            Object.assign({}, view, {
              title: view.meta.title || 'no-name',
            })
          );
        } else {
          state.visitedViews.push(
            Object.assign({}, view, {
              title: view.meta.title || 'no-name',
            })
          );
        }
      } else {
        state.visitedViews.push(
          Object.assign({}, view, {
            title: view.meta.title || 'no-name',
          })
        );
      }
    } else {
      state.visitedViews.splice(
        0,
        0,
        Object.assign({}, view, {
          title: view.meta.title || 'no-name',
        })
      );
    }
    sessionStorage.setItem('indexTabs', JSON.stringify(state.visitedViews));
  },
  DEL_VISITED_VIEW: (state, viewPath) => {
    if (state.visitedViews.length > 1) {
      state.visitedViews.forEach((v, i) => {
        if (v.fullPath === viewPath) {
          state.visitedViews.splice(i, 1);
          store.commit('cache/DEL_CACHED_VIEW', v);
          if (viewPath === router.currentRoute.value.path) {
            if (i === 0) {
              router.push(state.visitedViews[0].path).then();
            } else {
              router.push(state.visitedViews[i - 1].path).then();
            }
          }
        }
      });
      sessionStorage.setItem('indexTabs', JSON.stringify(state.visitedViews));
    }
  },
};

const actions = {
  addView({ dispatch }, view) {
    dispatch('addVisitedView', view);
    dispatch('addCachedView', view);
  },
  delView({ dispatch }, view) {
    dispatch('delVisitedView', view);
  },
  addCachedView({ commit }, view) {
    commit('ADD_CACHED_VIEW', view);
  },
  delCachedView({ commit, state }, view) {
    return new Promise((resolve) => {
      commit('DEL_CACHED_VIEW', view);
      resolve([...state.cachedViews]);
    });
  },
  addVisitedView({ commit }, view) {
    commit('ADD_VISITED_VIEW', view);
  },
  delVisitedView({ commit, state }, viewPath) {
    commit('DEL_VISITED_VIEW', viewPath);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
