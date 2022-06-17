<template>
  <el-row justify="end">
    <a-pagination
      v-if="device !== 'mobile'"
      size="small"
      show-total
      show-page-size
      v-model:current="page"
      :page-size-options="pageSize"
      :default-page-size="limit"
      :total="total"
      @change="handleCurrentChange"
      @page-size-change="handleSizeChange"
    />
    <el-pagination
      v-else
      small
      layout="prev, pager, next"
      v-model:current-page="page"
      :page-sizes="pageSize"
      :default-page-size="limit"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-row>
</template>

<script setup name="Pagination">
import { useStore } from 'vuex';
import { computed } from 'vue';

const store = useStore();

const emits = defineEmits(['update:pageNum', 'update:pageSize', 'callback']);
defineProps({
  total: {
    type: Number,
    required: true,
  },
  page: {
    type: Number,
  },
  limit: {
    type: Number,
  },
  pageSize: {
    type: Array,
    default: [5, 10, 15, 50, 100],
  },
});

const device = computed(() => store.getters.device);

/**
 * 页码数量改变
 */
const handleSizeChange = (val) => {
  emits('update:limit', val);
  emits('callback');
};

/**
 * 页码改变
 */
const handleCurrentChange = (val) => {
  emits('update:page', val);
  emits('callback');
};
</script>

<style scoped></style>
