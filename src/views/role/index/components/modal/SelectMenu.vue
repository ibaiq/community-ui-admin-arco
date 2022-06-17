<template>
  <!--PC端-->
  <a-modal
    v-if="store.getters.device !== 'mobile'"
    v-model:visible="modal.open"
    title-align="start"
    title="分配权限"
    modal-class="popups"
    @before-close="handleBeforeClose"
    @before-open="handleBeforeOpen"
    :width="500"
  >
    <a-row :gutter="[10, 10]">
      <a-col :span="12">
        <a-checkbox
          v-model="data.checked"
          :indeterminate="data.indeterminate"
          @change="handleChecked"
          >全选/反选
        </a-checkbox>
      </a-col>
      <a-col :span="12">
        <a-checkbox v-model="data.extend" @change="handleExpandAll"
          >展开/折叠
        </a-checkbox>
      </a-col>
      <a-col :span="24" style="margin-top: 10px">
        <a-tree
          ref="treeRef"
          checkable
          block-node
          style="max-height: 450px"
          :data="modal.menuList"
          :field-names="{ key: 'id', icon: false }"
        />
      </a-col>
    </a-row>
    <template #footer>
      <div class="dialog-footer">
        <a-space>
          <a-button type="primary" @click="submitForm">确 定</a-button>
          <a-button @click="modal.open = false">取 消</a-button>
        </a-space>
      </div>
    </template>
  </a-modal>
  <!--移动端-->
  <a-modal
    v-else
    v-model:visible="modal.open"
    title-align="start"
    title="分配权限"
    modal-class="dialog-mobile"
    @before-close="handleBeforeClose"
    @before-open="handleBeforeOpen"
    width="100%"
    fullscreen
  >
    <a-row :gutter="[10, 10]">
      <a-col :span="12">
        <a-checkbox
          v-model="data.checked"
          :indeterminate="data.indeterminate"
          @change="handleChecked($event)"
          >全选/反选
        </a-checkbox>
      </a-col>
      <a-col :span="12">
        <a-checkbox v-model="data.extend" @change="handleExpandAll"
          >展开/折叠
        </a-checkbox>
      </a-col>
      <a-col :span="24" style="margin-top: 10px">
        <a-tree
          ref="treeRef"
          checkable
          block-node
          :data="modal.menuList"
          :field-names="{ key: 'id', icon: false }"
        />
      </a-col>
    </a-row>
    <template #footer>
      <div class="dialog-footer">
        <a-space>
          <a-button type="primary" @click="submitForm">确 定</a-button>
          <a-button @click="modal.open = false">取 消</a-button>
        </a-space>
      </div>
    </template>
  </a-modal>
</template>

<script setup>
import { useStore } from 'vuex';
import { getCurrentInstance, reactive } from 'vue';
import { selectMenu } from '@/api/role.js';

const store = useStore();
const { proxy } = getCurrentInstance();

const props = defineProps({
  modal: {
    required: true,
    type: Object,
  },
});

const data = reactive({
  extend: true,
  checked: false,
  indeterminate: false,
  checkedIds: [],
  parentCheckKeys: [],
});

/**
 * 对话框关闭前事件
 */
const handleBeforeClose = () => {
  data.extend = true;
  data.checked = false;
  data.indeterminate = false;
  data.checkedIds = [];
  data.parentCheckKeys = [];
};

/**
 * 对话框打开前事件
 */
const handleBeforeOpen = () => {
  data.checkedIds = props.modal.authMenu;
  proxy.$refs.treeRef.checkNode(data.checkedIds, true);
  // proxy.$refs.treeRef.expandAll(data.extend);
  let list = treeList(props.modal.menuList);
  data.checked = proxy.$refs.treeRef.getCheckedNodes().length === list.length;
  data.indeterminate =
    proxy.$refs.treeRef.getCheckedNodes().length !== list.length &&
    proxy.$refs.treeRef.getCheckedNodes().length !== 0;
  handleExpandAll(data.extend);
};

/**
 * 提交修改
 */
const submitForm = () => {
  data.checkedIds = getMenuAllCheckedKeys();
  data.checkedIds.sort((a, b) => {
    return a - b;
  });
  selectMenu(props.modal.roleId, data.checkedIds).then(() => {
    props.modal.open = false;
    proxy.$message.success('权限分配成功');
  });
};

/**
 * 树权限（全选/反选）
 * @param change
 */
const handleChecked = (change) => {
  data.indeterminate = false;
  proxy.$refs.treeRef.checkAll(change);
};

/**
 * 树权限（展开/折叠）
 * @param change
 */
const handleExpandAll = (change) => {
  proxy.$refs.treeRef.expandNode(treeList(props.modal.menuList), change);
};

/**
 * 获取菜单所有选中的键
 */
const getMenuAllCheckedKeys = () => {
  // 目前被选中的菜单节点
  // let checkedKeys = proxy.$refs.treeRef.getCheckedKeys();
  let checkedKeys = proxy.$refs.treeRef.getCheckedNodes();
  checkedKeys = checkedKeys.map((item) => item.id);
  // 半选中的菜单节点
  let halfCheckedKeys = proxy.$refs.treeRef.getHalfCheckedNodes();
  halfCheckedKeys = halfCheckedKeys.map((item) => item.id);
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
  return checkedKeys;
};

const treeList = (list) => {
  let ids = [];
  list.forEach((item) => {
    ids.push(item.id);
    if (item.children) {
      ids.unshift.apply(ids, treeList(item.children));
    }
  });
  return ids;
};
</script>

<style lang="scss" scoped>
.arco-row {
  height: calc(100% - 10px);
  overflow: hidden;

  .arco-col:is(:last-child) {
    height: 100%;
    overflow: auto;
    padding-bottom: 50px;
  }
}

.el-row {
  height: calc(100% - 10px);
  overflow: hidden;

  .el-col:is(:last-child) {
    height: 100%;
    overflow: auto;
    padding-bottom: 50px;
  }
}
</style>
