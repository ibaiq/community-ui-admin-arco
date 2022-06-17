<template>
  <a-layout-header class="header">
    <div class="header-left" @click="toggleSidebar">
      <svg
        :class="{ 'is-active': isActive }"
        class="hamburger"
        viewBox="0 0 1024 1024"
        xmlns="http://www.w3.org/2000/svg"
        width="64"
        height="64"
      >
        <path
          transform="rotate(-180 512,512)"
          d="M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM142.4 642.1L298.7 519a8.84 8.84 0 0 0 0-13.9L142.4 381.9c-5.8-4.6-14.4-.5-14.4 6.9v246.3a8.9 8.9 0 0 0 14.4 7z"
        />
      </svg>
    </div>
    <top-nav id="topmenu-container" class="topmenu-container" />
    <div class="header-right">
      <a-space size="large">
        <!--刷新-->
        <a-tooltip mini content="刷新">
          <a-button type="text" size="mini" @click="handleRefresh">
            <template #icon>
              <icon-refresh />
            </template>
          </a-button>
        </a-tooltip>
        <!--切换颜色模式-->
        <a-dropdown trigger="hover" @select="toggleColorMode">
          <a-button type="text" size="mini" @click="btnToggleColorMode">
            <template #icon>
              <icon-sun-fill v-if="store.getters.colorMode === 'dark'" />
              <icon-desktop v-else-if="store.getters.colorMode === 'auto'" />
              <icon-moon-fill v-else />
            </template>
          </a-button>
          <template #content>
            <a-doption
              value="light"
              :style="{
                fontWeight: store.getters.colorMode === 'light' ? 600 : 400,
              }"
            >
              <template #icon>
                <icon-sun-fill />
              </template>
              亮色模式
            </a-doption>
            <a-doption
              value="dark"
              :style="{
                fontWeight: store.getters.colorMode === 'dark' ? 600 : 400,
              }"
            >
              <template #icon>
                <icon-moon-fill />
              </template>
              暗色模式
            </a-doption>
            <a-doption
              value="auto"
              :style="{
                fontWeight: store.getters.colorMode === 'auto' ? 600 : 400,
              }"
            >
              <template #icon>
                <icon-desktop />
              </template>
              跟随系统
            </a-doption>
          </template>
        </a-dropdown>
        <!--页面配置-->
        <a-tooltip mini content="页面配置">
          <a-button
            type="text"
            size="mini"
            @click="store.dispatch('app/showSettings')"
          >
            <template #icon>
              <icon-settings />
            </template>
          </a-button>
        </a-tooltip>
        <!--头像菜单-->
        <a-dropdown trigger="hover">
          <a-avatar :size="34">
            <img :src="data.user.avatar" alt="" />
          </a-avatar>
          <template #content>
            <div class="drop-header">
              <a-avatar :size="35">
                <img :src="data.user.avatar" alt="" />
              </a-avatar>
              <span>{{ data.user.nickname }}</span>
            </div>
            <div
              style="border-top: 1px solid var(--color-fill-3); margin: 4px 0"
            />
            <a-doption>
              <template #icon>
                <icon-user />
              </template>
              个人设置
            </a-doption>
            <div
              style="border-top: 1px solid var(--color-fill-3); margin: 4px 0"
            />
            <a-doption @click="handleLogout">
              <template #icon>
                <icon-export />
              </template>
              退出登录
            </a-doption>
          </template>
        </a-dropdown>
      </a-space>
    </div>
  </a-layout-header>
</template>

<script setup name="Header">
import { useStore } from 'vuex';
import TopNav from '../topnav/Index.vue';
import { reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

defineProps({
  isActive: Boolean,
});

const store = useStore();
const router = useRouter();
const route = useRoute();

const data = reactive({
  user: {},
});

if (!store.getters.user) {
  store.dispatch('user/Profile').then((res) => {
    data.user = res.data;
  });
} else {
  data.user = store.getters.user;
}

const toggleSidebar = () => {
  store.dispatch('app/toggleSidebar');
};

const toggleColorMode = (mode) => {
  store.dispatch('app/toggleArcoTheme', mode);
};

const btnToggleColorMode = () => {
  if (store.getters.colorMode !== 'auto') {
    if (store.getters.colorMode === 'dark') {
      store.dispatch('app/toggleArcoTheme', 'light');
    } else {
      store.dispatch('app/toggleArcoTheme', 'dark');
    }
  }
};

const handleLogout = async () => {
  store.commit('menu/SET_TOP_NAV_ROUTES', []);
  store.commit('menu/SET_MENUS', []);
  store.commit('menu/SET_ROUTES', []);
  await store.dispatch('user/Logout');
  location.href = '/';
};

const handleRefresh = () => {
  store.dispatch('cache/delCachedView', route).then(() => {
    router.replace({
      path: `/redirect${route.path}`,
      query: route.query,
    });
  });
};
</script>

<style lang="scss" scoped>
@import '/src/assets/variables';

.header {
  position: relative;
  z-index: 888;
  overflow: hidden;
  display: flex;
  width: 100%;
  height: var(--header-height);
  background: var(--color-bg-2);
  transition: width 0.28s;
  box-shadow: 0 0 12px -5px rgb(0 0 0 / 8%);

  .header-left {
    float: left;
    line-height: var(--header-line-height);
    align-items: center;
    padding: 0 15px;
    font-size: 22px;

    svg {
      height: 22px;
      width: 25px;
      vertical-align: middle;

      path {
        fill: var(--color-text-1) !important;
      }
    }
  }

  .topmenu-container {
  }

  .header-right {
    align-items: center;
    display: flex;
    padding: 0 25px 0 15px;

    .arco-avatar {
      img {
        object-fit: cover;
      }
    }

    .arco-btn {
      color: var(--color-text-1);
      font-size: 18px;
    }
  }

  .is-active {
    transform: rotate(180deg);
  }
}

.drop-header {
  padding: 5px 12px;

  .arco-avatar {
    margin-right: 10px;
    cursor: inherit;
    font-size: inherit !important;
  }

  span {
    color: var(--customed-text-color);
    font-size: 14px;
    font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
    font-weight: 600;
    cursor: inherit;
    letter-spacing: 1.5px;
  }
}

.drop-header:hover {
  cursor: pointer;
}
</style>
