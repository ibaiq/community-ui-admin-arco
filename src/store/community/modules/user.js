import { getToken, remove } from '@/utils/auth.js';
import { logout, profile } from '@/api/user.js';
import { Message } from '@arco-design/web-vue';

const state = {
  token: getToken(),
  user: undefined,
  haveRevert: false,
  haveDelete: false,
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_USER: (state, user) => {
    state.user = user;
  },
  set_have_revert: (state, haveRevert) => {
    state.haveRevert = haveRevert;
  },
  set_have_delete: (state, haveDelete) => {
    state.haveDelete = haveDelete;
  },
};

const actions = {
  Profile: ({ commit }) => {
    return new Promise((resolve, reject) => {
      profile()
        .then((res) => {
          let reg =
            /^(http:\/\/|https:\/\/|\/\/)?(([A-Za-z0-9]+-[A-Za-z0-9]+|[A-Za-z0-9]+)\.)+([A-Za-z]+)[/?:]?.*$/;
          res.data.avatar = reg.test(res.data.avatar)
            ? res.data.avatar
            : import.meta.env.VITE_APP_BASE_API + res.data.avatar;
          commit('SET_USER', res.data);
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  Logout: ({ commit }) => {
    return new Promise((resolve, reject) => {
      logout()
        .then(() => {
          commit('SET_TOKEN', undefined);
          commit('SET_USER', undefined);
          resolve();
        })
        .catch(() => {
          commit('SET_TOKEN', undefined);
          commit('SET_USER', undefined);
          reject();
        });
      remove();
      Message.success('注销成功');
    });
  },
  async setHaveRevert({ commit }, haveRevert) {
    await commit('set_have_revert', haveRevert);
  },
  async setHaveDelete({ commit }, haveDelete) {
    await commit('set_have_delete', haveDelete);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
