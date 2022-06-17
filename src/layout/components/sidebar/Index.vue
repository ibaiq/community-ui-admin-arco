<template>
  <logo :collapse="!isCollapse" />
  <a-menu
    :collapsed-width="64"
    auto-open-selected
    auto-scroll-into-view
    :selected-keys="[activeMenu]"
  >
    <SidebarItem
      v-for="route in sidebarRoutes"
      :item="route"
      :base-path="route.path"
    />
  </a-menu>
</template>

<script setup name="Sidebar">
import Logo from './Logo.vue';
import { computed, watch } from 'vue';
import { useStore } from 'vuex';
import SidebarItem from '@/layout/components/sidebar/SidebarItem.vue';
import { useRoute } from 'vue-router';

const store = useStore();
const route = useRoute();

const sidebarRoutes = computed(() => store.getters.menus);
const isCollapse = computed(() => store.getters.sidebar);

watch(
  () => store.getters.device,
  (now) => {
    if (now === 'mobile') {
      store.dispatch('app/closeSidebar');
    } else {
      store.dispatch('app/openSidebar');
    }
  }
);

const activeMenu = computed(() => {
  const { path } = route;
  return path;
});
</script>

<style scoped></style>
