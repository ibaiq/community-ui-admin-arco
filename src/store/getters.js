const getters = {
  token: (state) => state.user.token,
  user: (state) => state.user.user,
  menus: (state) => state.menu.menus,
  routes: (state) => state.menu.routes,
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  topNav: (state) => state.menu.topNavRoutes,
  sentence: (state) => state.app.sentence,
  language: (state) => state.app.language,
  history: (state) => state.app.history,
  colorMode: (state) => state.app.colorMode,
  settings: (state) => state.app.settings,
  showSettings: (state) => state.app.showSettings,
  cachedViews: (state) => state.cache.cachedViews,
  haveRevert: (state) => state.user.haveRevert,
  haveDelete: (state) => state.user.haveDelete,
  iconPath: (state) => state.app.iconPath,
};

export default getters;
