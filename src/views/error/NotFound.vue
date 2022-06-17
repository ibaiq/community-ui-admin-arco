<template>
  <div class="content">
    <a-result class="result" status="404" subtitle="抱歉，页面不见了～">
      <template #extra>
        <a-space>
          <a-button key="again">重试</a-button>
          <a-button
            v-if="store.getters.history === '/'"
            key="home"
            type="primary"
            @click="$router.replace('/')"
            >返回首页
          </a-button>
          <a-button v-else key="back" type="primary" @click="$router.back()">
            返回
          </a-button>
        </a-space>
      </template>
    </a-result>
  </div>
</template>

<script setup>
import { useStore } from "vuex";

const store = useStore();
</script>

<style lang="scss" scoped>
.content {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
