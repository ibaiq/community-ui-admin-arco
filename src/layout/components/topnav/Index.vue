<template>
  <a-menu
    mode="horizontal"
    :default-selected-keys="[activeMenu]"
    @menu-item-click="handleSelect"
  >
    <a-menu-item v-for="item in topMenus" :key="item.path">
      {{ item.meta.title }}
    </a-menu-item>
  </a-menu>
</template>

<script setup name="TopNav">
import { computed, reactive } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { isHttp } from '@/utils/validate.js';
import { resolve } from 'path-browserify';

const store = useStore();
const route = useRoute();
const router = useRouter();

const data = reactive({
  // 是否为首次加载
  isFrist: false,
  // 当前激活菜单的 index
  currentIndex: undefined,
});

// 所有的路由信息
const routers = computed(() => store.getters.topNav);

// 顶部显示菜单
const topMenus = computed(() => {
  let topMenus = [];
  routers.value.map((menu) => {
    if (menu.hidden !== true) {
      topMenus.push(menu);
    }
  });
  return topMenus;
});

// 设置子路由
const childrenMenus = computed(() => {
  let childrenMenus = [];
  routers.value.map((router) => {
    for (let item in router.children) {
      if (router.children[item].parentPath === undefined) {
        if (!isHttp(router.children[item].path)) {
          router.children[item].path =
            // router.path + '/' + router.children[item].path;
            resolve(router.path, router.children[item].path);
        }
        router.children[item].parentPath = router.path;
      }
      childrenMenus.push(router.children[item]);
    }
  });
  return childrenMenus;
});

// 默认激活的菜单
const activeMenu = computed(() => {
  const current = route.path;
  let activePath = defaultRouter.value;
  if (current !== undefined && current.lastIndexOf('/') > 0) {
    const tmpPath = current.substring(activePath.length, current.length);
    activePath = resolve('/', tmpPath.substring(0, tmpPath.indexOf('/')));
  } else if (defaultRouter.value === current || '' === current) {
    if (!data.isFrist) {
      data.isFrist = true;
    } else {
      activePath = defaultRouter.value;
    }
  }
  let routes = activeRoutes(activePath);
  if (routes.length === 0) {
    activePath = data.currentIndex || defaultRouter.value;
    activeRoutes(activePath);
  }
  return activePath;
});

// 默认激活的路由
const defaultRouter = computed(() => {
  let router;
  Object.keys(routers.value).some((key) => {
    if (!routers.value[key].hidden) {
      router = routers.value[key].path;
      return true;
    }
  });
  return router;
});

function handleSelect(key) {
  data.currentIndex = key;
  if (isHttp(key)) {
    // http(s):// 路径新窗口打开
    window.open(key, '_blank');
  } else if (key.indexOf('/redirect') !== -1) {
    // /redirect 路径内部打开
    router.push({ path: key.replace('/redirect', '') });
  } else {
    // 显示左侧联动菜单
    activeRoutes(key);
  }
}

function activeRoutes(key) {
  let routes = [];
  if (childrenMenus.value && childrenMenus.value.length > 0) {
    childrenMenus.value.map((item) => {
      if (key === item.parentPath) {
        routes.push(item);
      }
    });
  }
  if (routes.length > 0) {
    store.commit('menu/SET_MENUS', routes);
  }
  return routes;
}
</script>

<style lang="scss" scoped>
.topmenu-container {
  :deep(.arco-menu-inner) {
    padding: 14px 0;

    .arco-menu-item {
      margin-left: 0;
    }
  }

  :deep(.arco-menu-selected-label) {
    display: none;
  }
}
</style>
