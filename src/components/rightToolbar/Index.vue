<template>
  <a-row justify="end">
    <a-space>
      <a-tooltip
        v-if="searchBtn"
        mini
        :content="showSearch ? '隐藏搜索' : '显示搜索'"
      >
        <a-button @click="toggleSearch" shape="circle">
          <template #icon>
            <icon-search />
          </template>
        </a-button>
      </a-tooltip>
      <a-tooltip mini content="刷新">
        <a-button @click="refresh" shape="circle">
          <template #icon>
            <icon-refresh />
          </template>
        </a-button>
      </a-tooltip>
    </a-space>
  </a-row>

  <el-dialog
    v-if="data.dialog.open"
    title="显示/隐藏"
    custom-class="popups"
    v-model="data.dialog.open"
    append-to-body
  >
    <div style="width: fit-content; margin: auto">
      <el-transfer
        :titles="['显示', '隐藏']"
        v-model="data.dialog.value"
        :data="columns"
        @change="dataChange"
      />
    </div>
  </el-dialog>
</template>

<script setup name="RightToolbar">
import { reactive, watch } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const props = defineProps({
  showSearch: {
    type: Boolean,
  },
  searchBtn: {
    type: Boolean,
    default: false,
  },
  columns: {
    type: Array,
  },
});

const emits = defineEmits(['update:showSearch', 'refresh']);

const data = reactive({
  dialog: {
    open: false,
    value: [],
  },
});

watch(
  () => store.getters.device,
  (value) => {
    if (value === 'mobile') {
      data.dialog.open = false;
    }
  }
);

/**
 * 显示/隐藏，搜索工具
 */
const toggleSearch = () => {
  emits('update:showSearch', !props.showSearch);
};

/**
 * 刷新列表
 */
const refresh = () => {
  emits('refresh');
};

const showColumn = () => {
  data.dialog.open = true;
};

/**
 * 右侧列表元素变化
 */
const dataChange = (data) => {
  for (let item in props.columns) {
    const key = props.columns[item].key;
    props.columns[item].visible = !data.includes(key);
  }
};

// 显隐列初始默认隐藏列
for (let item in props.columns) {
  if (props.columns[item].visible === false) {
    data.dialog.value.push(parseInt(item));
  }
}
</script>

<style scoped></style>
