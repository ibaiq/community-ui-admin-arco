<template>
  <template v-if="data.length > 0">
    <a-table
      :stripe="stripe"
      :bordered="{
        wrapper: true,
        cell: true,
      }"
      :show-header="data.length > 0"
      :data="data"
      :row-key="rowKey"
      hide-expand-button-on-empty
      :default-expand-all-rows="isExpandAll"
      ref="tableRef"
      :pagination="false"
      v-loading="loading"
      v-if="refreshTable"
      @row-click="handleRowClick"
    >
      <template #columns>
        <Column :columns="columns" @status="handleStatusChange" />
        <slot name="option"></slot>
      </template>
    </a-table>
  </template>
  <a-empty v-else />
</template>

<script setup>
import Column from './Column.vue';
import { getCurrentInstance, nextTick, ref } from 'vue';

const props = defineProps({
  stripe: {
    type: Boolean,
    default: false,
  },
  border: {
    type: Boolean,
    default: false,
  },
  rowKey: {
    type: String,
    default: 'id',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Array,
    required: true,
  },
  checkbox: {
    type: Boolean,
    default: false,
  },
  expansionAll: {
    type: Boolean,
    default: undefined,
  },
  columns: {
    type: Array,
    required: true,
  },
});
const emits = defineEmits(['status']);

const { proxy } = getCurrentInstance();

const refreshTable = ref(true);
const isExpandAll = ref(props.expansionAll);

const handleStatusChange = (status, record) => {
  emits('status', status, record);
};

const handleRowClick = (record, event) => {
};

const toggleAllExpansion = () => {
  if (props.expansionAll !== undefined) {
    refreshTable.value = false;
    isExpandAll.value = !isExpandAll.value;
    nextTick(() => {
      refreshTable.value = true;
    });
    return isExpandAll.value;
  }
};

defineExpose({
  toggleAllExpansion,
});
</script>

<style scoped></style>
