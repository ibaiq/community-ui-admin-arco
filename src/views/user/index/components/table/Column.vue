<template>
  <el-table-column
    v-for="column in columns"
    :resizable="column.resizable"
    :label="column.label"
    :key="column.key"
    :prop="column.key"
    :align="column.align"
    :sortable="column.sort"
    :min-width="column.minWidth"
    :width="column.width"
    :show-overflow-tooltip="column.tooltip"
  >
    <template v-slot="{ row }">
      <cell :record="row" :column="column" @status="handleStatusChange" />
    </template>
  </el-table-column>
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
