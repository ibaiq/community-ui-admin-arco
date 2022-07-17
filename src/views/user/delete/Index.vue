<template>
  <div>
    <div class="card">
      <a-row :gutter="[15, 15]">
        <!--搜索部分-->
        <a-col :span="24" data-search :class="{ hiddenSearch: !showSearch }">
          <a-form :model="params" layout="inline" size="small">
            <a-form-item label="用户名" field="username">
              <a-input
                v-model="params.username"
                placeholder="请输入用户名"
                allow-clear
              />
            </a-form-item>
            <a-form-item label="昵称" field="nickname">
              <a-input
                v-model="params.nickname"
                placeholder="请输入昵称"
                allow-clear
              />
            </a-form-item>
            <a-form-item label="性别" field="sex">
              <a-select v-model="params.sex" allow-clear placeholder="请选择">
                <a-option label="未知" value="0">未知</a-option>
                <a-option label="男" value="1">男</a-option>
                <a-option label="女" value="2">女</a-option>
              </a-select>
            </a-form-item>
            <a-form-item label="状态" field="status">
              <a-select
                v-model="params.status"
                allow-clear
                placeholder="请选择"
              >
                <a-option label="正常" value="true">正常</a-option>
                <a-option label="禁用" value="false">禁用</a-option>
              </a-select>
            </a-form-item>
            <a-form-item hide-label>
              <a-button type="primary" @click="handleSearch">
                <template #icon>
                  <icon-search />
                </template>
                搜索
              </a-button>
            </a-form-item>
            <a-form-item hide-label>
              <a-button type="primary" @click="handleResetSearch">
                <template #icon>
                  <icon-refresh />
                </template>
                重置
              </a-button>
            </a-form-item>
          </a-form>
        </a-col>
        <!--工具部分-->
        <a-col :span="24">
          <a-row>
            <a-col :span="14">
              <a-space>
                <a-button
                  :disabled="!selected.multiple"
                  type="primary"
                  @click="handleRevert"
                >
                  <template #icon>
                    <icon-undo />
                  </template>
                  还原
                </a-button>
              </a-space>
            </a-col>
            <a-col :span="10">
              <RightToolbar
                v-model:show-search="showSearch"
                :columns="columns"
                @refresh="getList"
              />
            </a-col>
          </a-row>
        </a-col>
        <!--数据展示部分-->
        <a-col :span="24">
          <Table
            border
            stripe
            checkbox
            :columns="columns"
            :data="list"
            :loading="loading"
            @status="handleStatusChange"
            @selection="handleSelectionChange"
          >
            <template #option>
              <el-table-column
                resizable
                align="center"
                label="操作"
                :width="100"
                v-slot="{ row }"
              >
                <a-space>
                  <el-button
                    type="text"
                    size="small"
                    @click="handleRevert(row)"
                  >
                    <template #icon>
                      <icon-undo />
                    </template>
                    还原
                  </el-button>
                </a-space>
              </el-table-column>
            </template>
          </Table>
        </a-col>
        <!--分页部分-->
        <a-col :span="24">
          <Pagination
            v-show="total > 0"
            :total="total"
            v-model:page="params.pageNum"
            v-model:limit="params.pageSize"
            :page-size="pageSize"
            @callback="getList"
          />
        </a-col>
      </a-row>
    </div>
    <!--对话框部分-->
    <AddAndUpdate v-if="dialog.open" :window="dialog" @refresh="getList" />
  </div>
</template>

<script setup name="User-delete">
import { getCurrentInstance, h, reactive, resolveComponent, toRefs } from 'vue';
import { getDelList, modifyStatus, revertUser } from '@/api/user.js';
import { isExternal } from '@/utils/validate.js';
import { useStore } from 'vuex';
import AddAndUpdate from '../index/components/modal/AddAndUpdate.vue';
import RightToolbar from '@/components/rightToolbar/Index.vue';
import Pagination from '@/components/pagination/Index.vue';
import Table from '../index/components/table/Table.vue';
import getters from '@/store/getters.js';

const { proxy } = getCurrentInstance();
const store = useStore();

const data = reactive({
  list: [],
  loading: true,
  total: 0,
  pageSize: [5, 10, 15, 50, 100],
  showSearch: true,
  selected: {
    multiple: false,
    item: [],
  },
  params: {
    pageNum: 1,
    pageSize: 10,
    // TODO 以下是每个页面需要的参数，自行添加
    username: undefined,
    nickname: undefined,
    sex: undefined,
    status: undefined,
  },
  dialog: {
    open: false,
    title: '',
    row: {},
    rules: {},
  },
  columns: [
    {
      key: 'id',
      label: `编号`,
      visible: true,
      align: 'center',
      minWidth: 90,
      sort: true,
    },
    {
      key: 'username',
      label: `用户名`,
      visible: true,
      align: 'center',
      minWidth: 120,
      tooltip: true,
    },
    {
      key: 'avatar',
      label: `头像`,
      visible: true,
      img: true,
      align: 'center',
      width: 80,
      noClickSelect: true,
    },
    {
      key: 'nickname',
      label: `昵称`,
      visible: true,
      align: 'center',
      minWidth: 100,
    },
    {
      key: 'status',
      label: `状态`,
      visible: true,
      align: 'center',
      width: 80,
      switch: true,
      noClickSelect: true,
    },
    {
      key: 'sex',
      label: `性别`,
      visible: true,
      align: 'center',
      minWidth: 100,
      tag: true,
    },
    {
      key: 'created',
      label: `创建时间`,
      visible: true,
      align: 'center',
      minWidth: 170,
      sort: true,
    },
    {
      key: 'updated',
      label: `更新时间`,
      visible: true,
      align: 'center',
      minWidth: 170,
      sort: true,
    },
  ],
  // TODO 其他数据自行添加
  initPwd: '',
});

/**
 * 监听到有删除用户自动刷新数据
 */
store.watch(getters.haveDelete, (value) => {
  if (value) {
    getList();
    store.dispatch('user/setHaveDelete', false);
  }
});

/**
 * 获取展示数据列表
 */
const getList = () => {
  data.loading = true;
  getDelList(data.params)
    .then((res) => {
      data.list = res.data.records;
      data.list.forEach((user) => {
        if (!isExternal(user.avatar)) {
          user.avatar = import.meta.env.VITE_APP_BASE_API + user.avatar;
        }
      });
      data.total = res.data.total;
      data.loading = false;
    })
    .catch(() => {
      data.loading = false;
    });
};

getList();

/**
 * 修改状态
 */
const handleStatusChange = (row) => {
  let text = row.status ? '启用' : '禁用';
  proxy.$modal.open({
    titleAlign: 'start',
    width: 400,
    title: () =>
      h('span', [
        h(resolveComponent('icon-exclamation-circle-fill')),
        h('span', '系统提示'),
      ]),
    content: h(
      'p',
      {
        style: {
          wordBreak: 'break-all',
          margin: 0,
        },
      },
      [
        h('span', `确认要${text}「`),
        h('b', row.username),
        h('span', '」用户吗？'),
      ]
    ),
    onOk: () => {
      modifyStatus(row.id, row.status)
        .then(() => {
          proxy.$message.success(text + '成功');
        })
        .catch(() => {
          row.status = !row.status;
        });
    },
    onCancel: () => {
      row.status = !row.status;
    },
  });
};

/**
 * 恢复删除的用户
 */
const handleRevert = (row) => {
  let username =
    row.username || data.selected.item.map((item) => item.username);
  let userId = [];
  if (row.id) {
    userId.push(row.id);
  } else {
    userId = data.selected.item.map((item) => item.id);
  }
  proxy.$modal.warning({
    title: '系统提示',
    content: () =>
      h(
        'p',
        {
          style: {
            wordBreak: 'break-all',
            margin: 0,
          },
        },
        [
          h('span', '确认要还原「'),
          h('b', `${username}`),
          h('span', '」用户吗？'),
        ]
      ),
    escToClose: true,
    closable: true,
    width: 460,
    mask: true,
    onOk: () => {
      revertUser(userId).then(() => {
        proxy.$message.success('恢复成功');
        if (data.list.length - userId.length === 0) {
          let copy_pageNum = data.params.pageNum;
          if (copy_pageNum - 1 > 0) {
            data.params.pageNum -= 1;
          }
        }
        getList();
        proxy.$refs.tableRef.selectAll(false);
        store.dispatch('user/setHaveRevert', true);
      });
    },
    onCancel: () => {},
  });
};

/**
 * 选择条目
 */
const handleSelectionChange = (selection) => {
  data.selected.item = selection;
  data.selected.multiple = selection.length;
};

/**
 * 条件搜索
 */
const handleSearch = () => {
  data.params.pageNum = 1;
  getList();
};

/**
 * 重置搜索
 */
const handleResetSearch = () => {
  data.params = {
    pageNum: data.params.pageNum,
    pageSize: data.params.pageSize,
    username: '',
    nickname: '',
    sex: '',
    status: '',
  };
  handleSearch();
};

const {
  selected,
  columns,
  dialog,
  total,
  loading,
  list,
  params,
  pageSize,
  showSearch,
} = toRefs(data);
</script>

<style lang="scss" scoped>
.el-image {
  border-radius: 50%;
  display: inline-table;

  :deep(.el-image__inner) {
    width: 40px;
    height: 40px;
  }
}

.card {
  .arco-row {
    .arco-form-item {
      :deep(.arco-select-view-single) {
        width: 6rem;
      }

      :deep(.arco-input-wrapper) {
        width: 10rem;
      }
    }
  }
}

.card .arco-form-layout-inline .arco-form-item {
  margin-bottom: 15px;
}

.arco-icon {
  margin-right: 0;
}

.arco-col[data-search] {
  transition: 1s ease-in-out;
  opacity: 1;
  max-height: 1000px;
  overflow: hidden;
}

.hiddenSearch {
  opacity: 0 !important;
  max-height: 0 !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
</style>
