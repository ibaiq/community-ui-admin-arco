<template>
  <div class="app-wrapper" :class="classObj">
    <div
      v-if="device === 'mobile' && sidebar"
      class="drawer-bg"
      @click="handleClickOutside"
    ></div>
    <a-layout-sider
      class="sidebar-container"
      :collapsed="!sidebar"
      collapsible
      hide-trigger
    >
      <Sidebar />
    </a-layout-sider>
    <a-layout class="main-container">
      <Header :is-active="!sidebar" />
      <app-main />
    </a-layout>
  </div>
</template>

<script setup>
import { useStore } from 'vuex';
import { computed, getCurrentInstance, onMounted, watch } from 'vue';
import { AppMain, Header, Sidebar } from '@/layout/components';
import { useRoute } from 'vue-router';

const { proxy } = getCurrentInstance();
const store = useStore();
const route = useRoute();

const sidebar = computed(() => store.getters.sidebar);
const device = computed(() => store.getters.device);
const settings = computed(() => store.getters.settings);
const classObj = computed(() => ({
  'hideSidebar': !sidebar.value,
  'openSidebar': sidebar.value,
  'mobile': device.value === 'mobile',
  'header-fixed': settings.value.fixedHeader,
  'sidebarShadow': settings.value.sidebarMenuShadow,
  'pageShadow': settings.value.pageShadow,
  'headerStripe': settings.value.headerStripe,
}));

watch(route, () => {
  if (route.name) {
    store.dispatch('cache/addView', route);
  }
  return false;
});

onMounted(() => {
  let first = JSON.parse(sessionStorage.getItem('first'));
  const hour = new Date().getHours();
  const thisTime =
    hour < 8
      ? '早上好'
      : hour <= 11
      ? '上午好'
      : hour <= 13
      ? '中午好'
      : hour < 18
      ? '下午好'
      : '晚上好';
  if (!first) {
    proxy.$notification.success({
      title: thisTime + ' ' + store.getters.user.nickname,
      content: '欢迎来到Ibaiq后台管理系统',
      duration: 3000,
    });
    sessionStorage.setItem('first', JSON.stringify(true));
  }
});

const handleClickOutside = () => {
  store.dispatch('app/closeSidebar');
};
</script>

<style lang="scss" scoped>
@import '/src/assets/variables';
@import '/src/assets/mixin';

.el-container {
  display: block;
}

.app-wrapper {
  @include clearfix;
  height: 100%;
  width: 100%;
  position: relative;
}

.drawer-bg {
  background: black;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 900;
}
</style>
