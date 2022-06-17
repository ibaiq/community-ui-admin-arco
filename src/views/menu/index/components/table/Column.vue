<template>
  <a-table-column
    v-for="column in columns"
    :title="column.label"
    :data-index="column.key"
    :align="column.align"
    :sortable="column.sort"
    :width="column.width"
    :ellipsis="column.tooltip"
    :tooltip="column.tooltip"
  >
    <template #cell="{ record }">
      <cell :record="record" :column="column" @status="handleStatusChange" />
    </template>
  </a-table-column>
</template>

<script setup>
import Cell from './Cell.vue';

defineProps({
  columns: {
    type: Array,
    required: true,
  },
});
const emits = defineEmits(['status']);

const handleStatusChange = (status, record) => {
  emits('status', status, record);
};
</script>

<style scoped></style>
