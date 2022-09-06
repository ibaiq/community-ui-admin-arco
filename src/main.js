import { createApp } from 'vue';
import App from './App.vue';
import './assets/index.css';
import './assets/index.scss';
import 'nprogress/css/nprogress.css';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import store from '@/store/index.js';
import router from '@/router/index.js';
import * as ElIconModules from '@element-plus/icons-vue';
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon/index.js';
import '@arco-design/web-vue/dist/arco.css';
// import i18n from "@/i18n/i18n.js";
import { Icon } from '@arco-design/web-vue';
import { getConfValue } from '@/api/config.js';

const app = createApp(App);

const IconFont = Icon.addFromIconFontCn({
  src: 'https:' + import.meta.env.VITE_APP_ICON_URL,
});

app.component('icon-font', IconFont);

for (let iconName in ElIconModules) {
  app.component(iconName, ElIconModules[iconName]);
}

app
  .use(router)
  .use(store)
  .use(ElementPlus, {
    locale: zhCn,
  })
  .use(ArcoVue)
  .use(ArcoVueIcon)
  .mount('#app');
