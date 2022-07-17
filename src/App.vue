<template>
  <router-view />
  <settings :visible="store.getters.showSettings" />
</template>

<script setup>
import { onMounted, watchEffect } from 'vue';
import { useStore } from 'vuex';
import Settings from './components/settings/Index.vue';
import { useWindowSize } from '@vueuse/core';

const store = useStore();

const { width } = useWindowSize();
const WIDTH = 992;

const setThemeColor = () => {
  if (store.getters.colorMode === 'auto') {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.body.setAttribute('arco-theme', 'dark');
    } else {
      document.body.removeAttribute('arco-theme');
    }
  } else if (store.getters.colorMode === 'dark') {
    document.body.setAttribute('arco-theme', 'dark');
  } else {
    document.body.removeAttribute('arco-theme');
  }
};

onMounted(() => {
  setThemeColor();

  if (store.getters.colorMode === 'auto') {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => {
        setThemeColor();
      });
  } else if (store.getters.colorMode === 'dark') {
    document.body.setAttribute('arco-theme', 'dark');
  } else {
    document.body.removeAttribute('arco-theme');
  }

  if (store.getters.settings.colorWeek) {
    document.body.style.filter = 'invert(80%)';
  } else {
    document.body.style.filter = 'none';
  }
});

watchEffect(() => {
  if (width.value - 1 < WIDTH) {
    store.dispatch('app/toggleDevice', 'mobile');
  } else {
    store.dispatch('app/toggleDevice', 'desktop');
  }
});
</script>
