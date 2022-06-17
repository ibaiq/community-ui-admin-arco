<template>
  <div>
    <div class="card">
      <a-row :gutter="[20, 20]">
        <a-col :span="24">
          <a-descriptions title="基本信息">
            <a-descriptions-item label="用户名">
              <a-tag>{{ user.username }}</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="昵称">
              <a-tag>{{ user.nickname }}</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="角色">
              <a-space>
                <a-tag v-for="i in user.roles">{{ i.title }}</a-tag>
              </a-space>
            </a-descriptions-item>
          </a-descriptions>
        </a-col>
        <a-col :span="24">
          <a-descriptions title="角色列表" />
          <el-table
            stripe
            border
            :data="roleList.slice((pageNum - 1) * pageSize, pageNum * pageSize)"
            ref="tableRef"
            row-key="id"
            v-if="roleList.length > 0"
            @selection-change="handleCheckedChange"
          >
            <el-table-column type="selection" />
            <el-table-column
              v-for="item in columns"
              :label="item.title"
              :prop="item.dataIndex"
              :min-width="item.width"
            >
            </el-table-column>
          </el-table>
          <a-empty v-else />
        </a-col>
        <a-col>
          <pagination
            v-show="roleList.length > 0"
            :total="roleList.length"
            v-model:page="pageNum"
            v-model:limit="pageSize"
          />
        </a-col>
        <a-col :span="24">
          <a-space style="float: right" size="medium">
            <a-button @click="handleCancel">返回</a-button>
            <a-button @click="handleSubmit" type="primary">
              <template #icon>
                <icon-check-circle />
              </template>
              授权
            </a-button>
          </a-space>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup name="User-auth-role">
import {
  getCurrentInstance,
  nextTick,
  onBeforeMount,
  reactive,
  toRefs,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { authUserRole, getUser } from '@/api/user.js';
import { getRoleList } from '@/api/role.js';
import { useStore } from 'vuex';
import Pagination from '@/components/pagination/Index.vue';

const { proxy } = getCurrentInstance();
const route = useRoute();
const store = useStore();
const router = useRouter();

const data = reactive({
  user: {},
  userId: undefined,
  selectRoleIds: [],
  roleList: [],
  rowSelection: {
    type: 'checkbox',
    showCheckedAll: true,
  },
  columns: [
    { dataIndex: 'title', title: '角色', width: 160 },
    { dataIndex: 'name', title: '权限标识', width: 160 },
    { dataIndex: 'description', title: '角色功能', width: 500 },
  ],
  pageNum: 1,
  pageSize: 10,
});

data.userId = route.params.userId;

onBeforeMount(() => {
  init();
});

const init = () => {
  getUser(data.userId).then((res) => {
    data.user = res.data;
    getRoleList().then((res) => {
      data.roleList = res.data;
      let filter = data.roleList.filter((item) => {
        return data.user.roleIds.indexOf(item.id) !== -1;
      });
      nextTick(() => {
        filter.forEach((item) => {
          proxy.$refs.tableRef.toggleRowSelection(item);
        });
      });
    });
  });
};
const handleCheckedChange = (selection) => {
  let roles = selection.sort((a, b) => {
    return a.id - b.id;
  });
  data.selectRoleIds = roles.map((item) => item.id);
};

const handleSubmit = () => {
  authUserRole(data.userId, data.selectRoleIds).then(() => {
    proxy.$message.success('授权成功');
    handleCancel();
  });
};

const handleCancel = () => {
  let path = route.path;
  store.dispatch('cache/delView', path);
  router.replace('/user');
};

document.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    handleSubmit();
  }
});

const { user, roleList, columns, pageNum, pageSize } = toRefs(data);
</script>

<style lang="scss" scoped>
.arco-row {
  .arco-col {
    overflow: hidden;

    * {
      overflow: auto;
    }

    :deep(.arco-tree-node-title-text) {
      display: flex;
    }
  }
}
</style>
