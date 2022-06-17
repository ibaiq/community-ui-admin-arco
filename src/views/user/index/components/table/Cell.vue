<template>
  <a-avatar v-if="column.img">
    <img :src="record[column.key]" alt="" />
  </a-avatar>
  <a-switch
    v-else-if="column.switch"
    v-model="record.status"
    @change="handleStatusChange($event, record)"
  >
    <template #checked-icon>
      <icon-check />
    </template>
    <template #unchecked-icon>
      <icon-close />
    </template>
  </a-switch>
  <template v-else-if="column.tag">
    <a-tag v-if="record[column.key] === '0'" color="gray"> 未知</a-tag>
    <a-tag v-else-if="record[column.key] === '1'" color="blue">
      <icon-man />
      男
    </a-tag>
    <a-tag v-else-if="record[column.key] === '2'" color="magenta">
      <icon-woman />
      女
    </a-tag>
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
