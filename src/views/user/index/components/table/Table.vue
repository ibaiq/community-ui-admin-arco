<template>
  <el-table
    :stripe="stripe"
    :border="border"
    :show-header="data.length > 0"
    :data="data"
    :row-key="rowKey"
    ref="tableRef"
    v-if="data.length > 0"
    v-loading="loading"
    @selection-change="handleSelectionChange"
    @row-click="handleRowClick"
    @row-contextmenu="rightClick"
  >
    <el-table-column
      v-if="checkbox"
      type="selection"
      :width="60"
      align="center"
      class-name="custom-cell"
    />
    <Column :columns="columns" @status="handleStatusChange" />
    <slot name="option"></slot>
  </el-table>
  <a-empty v-else />
  <div ref="menu" id="menu">
    <slot ref="menu" name="rightMenu" />
  </div>
</template>

<script setup>
import Column from './Column.vue';
import { getCurrentInstance, watch } from 'vue';

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
  columns: {
    type: Array,
    required: true,
  },
});
const emits = defineEmits(['status', 'selection', 'rowContextmenu']);

const { proxy } = getCurrentInstance();

watch(
  () => props.data,
  (value) => {
    if (value.length <= 0) {
      handleSelectionChange([]);
    }
  }
);

const handleStatusChange = (status, record) => {
  emits('status', record);
};

const handleSelectionChange = (selection) => {
  emits('selection', selection);
};

const handleRowClick = (record, column) => {
  let filter = props.columns.some((item) => {
    if (item.key === column.rawColumnKey) {
      return !item.noClickSelect;
    }
  });
  if (filter && column.rawColumnKey !== 'options') {
    let rows = proxy.$refs.tableRef.getSelectionRows();
    let isSelected = rows.some((item) => item.id === record.id);
    proxy.$refs.tableRef.toggleRowSelection(record, !isSelected);
  }
};

const rightClick = (record, column, event) => {
  if (proxy.$slots.rightMenu) {
    event.preventDefault();
    let menu = proxy.$refs.menu;
    menu.classList.add('show-menu');
    // menu.style.top = `${event.clientY - 65}px`;
    menu.style.top = `${event.screenY}px`;
    // menu.style.left = `${event.clientX - 195}px`;
    menu.style.left = `${event.screenX}px`;
    emits('rowContextmenu', true, record);
  }
};
</script>

<style lang="scss" scoped>
#menu {
  position: absolute;
  z-index: -1;
  opacity: 0;
}

.show-menu {
  z-index: 1000 !important;
  opacity: 1 !important;
}
</style>
