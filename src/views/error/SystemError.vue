<template>
  <div class="content">
    <a-result class="result" status="500">
      <template #title> 系统出错了～</template>
      <template #subtitle>
        <icon-exclamation-circle-fill />
        系统异常，请刷新重试
        <icon-sync />
      </template>
      <template #extra>
        <a-space>
          <a-button key="refresh" @click="$router.go(0)">
            <template #icon>
              <icon-refresh />
            </template>
            重试
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
