<template>
  <router-view />
  <settings :visible="store.getters.showSettings" />
</template>

<script setup>
import { onMounted } from 'vue';
import { useStore } from 'vuex';
import Settings from './components/settings/Index.vue';

const store = useStore();

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
</script>
