<template>
  <a-drawer
    :visible="visible"
    mask-closable
    unmount-on-close
    :width="300"
    ok-text="保存配置"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <template #title>页面配置</template>
    <div class="block">
      <h5 class="title">配置信息</h5>
      <div v-for="item in data.column" class="switch-wrapper">
        <span>{{ item.title }}</span>
        <a-switch
          v-model="data.settings[item.key]"
          :disabled="
            (item.key === 'headerStripe' && !data.settings.pageShadow) ||
            (item.key === 'pageShadow' && data.settings.headerStripe) ||
            (item.key === 'breadcrumb' && data.settings.tabs) ||
            (item.key === 'tabs' && data.settings.breadcrumb)
          "
          :default-checked="item.defaultVal"
          size="small"
          @change="handleChange"
        />
      </div>
    </div>
    <div class="block">
      <h5 class="title">其他配置</h5>
      <div class="switch-wrapper">
        <span>色弱模式</span>
        <a-switch
          v-model="data.settings.colorWeek"
          size="small"
          @change="handleChange"
        />
      </div>
    </div>
    <a-alert
      >配置之后仅是临时生效，要想持续使用，点击下方的 "保存配置"
      按钮，将配缓存配置。
    </a-alert>
  </a-drawer>
</template>

<script setup name="Settings">
import { getCurrentInstance, onMounted, reactive } from 'vue';
import { useStore } from 'vuex';

const { proxy } = getCurrentInstance();
const store = useStore();

defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const data = reactive({
  settings: {},
  column: [
    { title: '固定导航栏', key: 'fixedHeader', defaultVal: false },
    { title: '页面去阴影化', key: 'pageShadow', defaultVal: false },
    { title: '导航栏线条', key: 'headerStripe', defaultVal: false },
    { title: '侧滑菜单阴影', key: 'sidebarMenuShadow', defaultVal: false },
    { title: '显示标签页', key: 'tabs', defaultVal: false },
    { title: '显示面包屑', key: 'breadcrumb', defaultVal: false },
  ],
});

onMounted(() => {
  data.settings = store.getters.settings;
});

const handleCancel = () => {
  store.dispatch('app/closeSettings');
};

const handleOk = () => {
  localStorage.setItem('settings', JSON.stringify(data.settings));
  proxy.$message.success('修改成功');
  store.dispatch('app/closeSettings');
};

const handleChange = () => {
  store.dispatch('app/modifySettings', data.settings);
};
</script>

<style scoped>
.block {
  margin-bottom: 24px;
}

.title {
  margin: 10px 0;
  padding: 0;
  font-size: 14px;
}

.switch-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
}
</style>
