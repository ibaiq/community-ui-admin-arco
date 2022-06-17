import defaultSettings from '../../../config/settings.json';

const state = {
  sidebar:
    localStorage.getItem('sidebarStatus') === undefined
      ? true
      : Boolean(eval(localStorage.getItem('sidebarStatus'))),
  device: 'desktop',
  sentence: '',
  language: localStorage.getItem('language') || 'zh_CN',
  history: undefined,
  colorMode: localStorage.getItem('arco-theme') || 'auto',
  settings: JSON.parse(localStorage.getItem('settings')) || defaultSettings,
  showSettings: false,
  iconPath: undefined
};

const mutations = {
  TOGGLE_SIDEBAR: (state) => {
    state.sidebar = !state.sidebar;
    localStorage.setItem('sidebarStatus', `${state.sidebar}`);
  },
  CLOSE_SIDEBAR: (state) => {
    state.sidebar = false;
    localStorage.setItem('sidebarStatus', `${state.sidebar}`);
  },
  OPEN_SIDEBAR: (state) => {
    state.sidebar = true;
    localStorage.setItem('sidebarStatus', `${state.sidebar}`);
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device;
  },
  SET_SENTENCE: (state, sentence) => {
    state.sentence = sentence;
  },
  SET_LANGUAGE: (state, language) => {
    state.language = language;
    localStorage.setItem('language', language);
  },
  SET_HISTORY: (state, history) => {
    state.history = history;
  },
  SET_ARCO_THEME: (state, colorMode) => {
    state.colorMode = colorMode;
    localStorage.setItem('arco-theme', colorMode);
  },
  set_settings: (state, settings) => {
    state.settings = settings;
    if (state.settings.colorWeek) {
      document.body.style.filter = 'invert(80%)';
    } else {
      document.body.style.filter = 'none';
    }
  },
  set_show_settings: (state, showSettings) => {
    state.showSettings = showSettings;
  },
};

const actions = {
  toggleSidebar({ commit }) {
    commit('TOGGLE_SIDEBAR');
  },
  openSidebar({commit}) {
    commit('OPEN_SIDEBAR')
  },
  closeSidebar({ commit }) {
    commit('CLOSE_SIDEBAR');
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device);
  },
  switchLanguage({ commit }, language) {
    commit('SET_LANGUAGE', language);
  },
  async toggleArcoTheme({ commit }, colorMode) {
    commit('SET_ARCO_THEME', colorMode);
    let autoColorMode = async () => {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.setAttribute('arco-theme', 'dark');
      } else {
        document.body.removeAttribute('arco-theme');
      }
    };
    if (colorMode === 'auto') {
      await autoColorMode();
      await window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', () => {
          autoColorMode();
        });
    } else if (colorMode === 'dark') {
      await document.body.setAttribute('arco-theme', 'dark');
    } else {
      await document.body.removeAttribute('arco-theme');
    }
  },
  async modifySettings({ commit }, settings) {
    await commit('set_settings', settings);
  },
  async showSettings({ commit }) {
    await commit('set_show_settings', true);
  },
  async closeSettings({ commit }) {
    await commit('set_show_settings', false);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
