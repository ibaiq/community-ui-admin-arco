<template>
  <a-layout-content class="app-main">
    <a-breadcrumb
      v-if="store.getters.settings.breadcrumb && levelList.length > 0"
    >
      <a-breadcrumb-item v-if="levelList[1].meta.icon.includes('#')">
        <icon-font :type="levelList[1].meta.icon.replace('#', '')" />
      </a-breadcrumb-item>
      <a-breadcrumb-item v-else>
        <component :is="levelList[1].meta.icon" />
      </a-breadcrumb-item>
      <a-breadcrumb-item v-for="item in levelList.slice(1)">
        {{ item.meta.title }}
      </a-breadcrumb-item>
    </a-breadcrumb>
    <a-tabs
      v-else-if="store.getters.settings.tabs"
      type="rounded"
      size="small"
      editable
      lazy-load
      animation
      :active-key="route.path"
      @tab-click="handleTabClick"
      @delete="handleTabClose"
    >
      <a-tab-pane
        v-for="tab in visitedViews"
        :title="tab.title"
        :key="tab.path"
        :closable="tab.path !== '/'"
      />
    </a-tabs>
    <router-view v-slot="{ Component }">
      <!--<transition name="fade-transform" mode="out-in">-->
      <keep-alive :include="cachedViews">
        <component :is="Component" />
      </keep-alive>
      <!--</transition>-->
    </router-view>
  </a-layout-content>
</template>

<script setup>
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { computed, ref, watch } from 'vue';

let store = useStore();
const route = useRoute();
const router = useRouter();
const levelList = ref([]);
const visitedViews = computed(() => store.state.cache.visitedViews);

store.dispatch('cache/addView', route);
const cachedViews = computed(() => {
  return store.getters.cachedViews;
});

const getBreadcrumb = () => {
  let matched = route.matched.filter((item) => item.meta && item.meta.title);
  levelList.value = matched.filter(
    (item) => item.meta && item.meta.title && item.meta.breadcrumb !== false
  );
};

watch(
  () => route.path,
  (now, old) => {
    if (now !== old) {
      getBreadcrumb();
    }
  }
);

const handleTabClick = (key) => {
  router.push(key);
};

const handleTabClose = (key) => {
  store.dispatch('cache/delView', key);
};

getBreadcrumb();
</script>

<style lang="scss" scoped>
.app-main {
  width: 100%;
  position: relative;
  overflow: hidden;
  padding: 15px;
}

.arco-breadcrumb {
  margin-bottom: 15px;
}

.arco-tabs {
  margin: 0 -5px;

  :deep(.arco-tabs-tab) {
    border-radius: 5px;
  }

  :deep(.arco-tabs-nav-type-rounded .arco-tabs-tab-active) {
    background-color: var(--color-bg-2);
  }

  :deep(.arco-tabs-nav-type-rounded .arco-tabs-tab-active):hover {
    background-color: var(--color-bg-2);
  }

  :deep(.arco-tabs-nav-type-rounded .arco-tabs-tab):hover {
    background-color: var(--color-bg-2);
  }
}

.svg-icon {
  margin-right: 0;
}

.arco-icon {
  margin-right: 0;
}
</style>
