<template>
  <div>
    <router-view v-slot="{ Component, route }">
      <!--<transition name="fade-transform" mode="out-in">-->
      <keep-alive :include="cachedViews">
        <component :key="route.path" :is="Component" />
      </keep-alive>
      <!--</transition>-->
    </router-view>
  </div>
</template>

<script setup name="ParentView">
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

const store = useStore();
const route = useRoute();

store.dispatch('cache/addView', route);

const cachedViews = computed(() => {
  return store.getters.cachedViews;
});
</script>
