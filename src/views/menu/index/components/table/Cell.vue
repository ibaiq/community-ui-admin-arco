<template>
  <template v-if="column.icon">
    <icon-font
      v-if="record[column.key].includes('#')"
      :type="record[column.key].replace('#', '')"
    />
    <component v-else :is="record[column.key]" />
  </template>
  <template v-else-if="column.visTag">
    <a-tag v-if="record[column.key]" color="green">可见</a-tag>
    <a-tag v-else>不可见</a-tag>
  </template>
  <template v-else-if="column.typeTag">
    <a-tag v-if="record[column.key] === 0" color="blue">目录</a-tag>
    <a-tag v-else-if="record[column.key] === 1" color="purple">菜单</a-tag>
    <a-tag v-else-if="record[column.key] === 2" color="orangered">按钮</a-tag>
  </template>
  <template v-else-if="column.sysTag">
    <a-tag v-if="record[column.key]" color="orangered">系统菜单</a-tag>
    <a-tag v-else color="arcoblue">普通菜单</a-tag>
  </template>
  <span v-else>{{ record[column.key] }}</span>
</template>

<script setup>
defineProps({
  record: {
    type: Object,
    required: true,
  },
  column: {
    type: Object,
    required: true,
  },
});
const emits = defineEmits(['status']);

const handleStatusChange = (status, record) => {
  emits('status', status, record);
};
</script>

<style scoped></style>
