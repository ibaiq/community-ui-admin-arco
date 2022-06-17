<template>
  <div>
    <div class="card">
      <a-row :gutter="[10, 10]">
        <!--搜索部分-->
        <a-col :span="24" data-search :class="{ hiddenSearch: !showSearch }">
          <a-form
            :model="params"
            layout="inline"
            size="small"
            @keyup.enter="handleSearch"
          >
            <a-form-item label="用户名" field="username">
              <a-input
                v-model="params.username"
                placeholder="请输入用户名"
                allow-clear
              />
            </a-form-item>
            <a-form-item label="状态" field="status">
              <a-select
                v-model="params.status"
                allow-clear
                placeholder="请选择"
              >
                <a-option label="成功" value="true">成功</a-option>
                <a-option label="失败" value="false">失败</a-option>
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
                  :disabled="total <= 0"
                  status="danger"
                  type="dashed"
                  @click="handleClear"
                >
                  <template #icon>
                    <icon-delete />
                  </template>
                  清空
                </a-button>
                <a-button
                  :disabled="!selected.multiple"
                  status="danger"
                  type="dashed"
                  @click="handleDelete"
                >
                  <template #icon>
                    <icon-delete />
                  </template>
                  删除
                </a-button>
              </a-space>
            </a-col>
            <a-col :span="10">
              <right-toolbar
                v-model:show-search="showSearch"
                :columns="columns"
                @refresh="getList"
              />
            </a-col>
          </a-row>
        </a-col>
        <!--数据展示部分-->
        <a-col>
          <a-table
            stripe
            :loading="loading"
            :data="list"
            :pagination="false"
            :bordered="{ wrapper: true, cell: true }"
            :row-selection="{ type: 'checkbox', showCheckedAll: true }"
            row-key="id"
            ref="tableRef"
            @selection-change="handleSelectionChange"
            v-if="list.length > 0"
          >
            <template #columns>
              <a-table-column
                v-for="item in columns"
                :width="item.width"
                :ellipsis="item.ellipsis"
                :align="item.align"
                :sortable="item.sortable"
                :title="item.title"
                :data-index="item.dataIndex"
              >
                <template #cell="{ record }">
                  <a-tooltip
                    v-if="item.ellipsis"
                    :content="record[item.dataIndex]"
                  >
                    <span>{{ record[item.dataIndex] }}</span>
                  </a-tooltip>
                  <template v-else-if="item.statusTag">
                    <a-tag v-if="record.status" color="green">成功</a-tag>
                    <a-tag v-else color="red">失败</a-tag>
                  </template>
                  <span v-else>{{ record[item.dataIndex] }}</span>
                </template>
              </a-table-column>
            </template>
          </a-table>
          <a-empty v-else />
        </a-col>
        <a-col>
          <pagination
            :total="total"
            v-model:page="params.pageNum"
            v-model:limit="params.pageSize"
            :page-size="pageSize"
            @callback="getList"
          />
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup name="Log-singin">
import { getCurrentInstance, h, reactive, resolveComponent, toRefs } from 'vue';
import { clear, deleted, singinList } from '@/api/singin.js';
import Pagination from '@/components/pagination/Index.vue';
import RightToolbar from '@/components/rightToolbar/Index';

const { proxy } = getCurrentInstance();

const data = reactive({
  list: [],
  total: 0,
  loading: true,
  pageSize: [5, 10, 15, 50, 100],
  showSearch: true,
  selected: {
    multiple: false,
    item: [],
  },
  params: {
    pageNum: 1,
    pageSize: 15,
    // TODO 以下是每个页面需要的参数，自行添加
    username: undefined,
    status: undefined,
  },
  columns: [
    {
      dataIndex: 'id',
      title: '编号',
      align: 'center',
      width: 100,
      sortable: {
        sortDirections: ['ascend', 'descend'],
      },
    },
    {
      dataIndex: 'username',
      title: '用户名',
      align: 'center',
      width: 120,
    },
    {
      dataIndex: 'ip',
      title: '登录地址',
      align: 'center',
      width: 120,
      ellipsis: true,
    },
    {
      dataIndex: 'loginLocation',
      title: '登录地点',
      align: 'center',
      width: 150,
      ellipsis: true,
    },
    {
      dataIndex: 'browser',
      title: '浏览器',
      align: 'center',
      width: 110,
    },
    {
      dataIndex: 'os',
      title: '操作系统',
      align: 'center',
      width: 120,
    },
    {
      dataIndex: 'status',
      title: '登录状态',
      align: 'center',
      width: 80,
      statusTag: true,
    },
    {
      dataIndex: 'msg',
      title: '操作信息',
      align: 'center',
      width: 100,
    },
    {
      dataIndex: 'loginTime',
      title: '登录时间',
      align: 'center',
      width: 175,
      sortable: {
        sortDirections: ['ascend', 'descend'],
      },
    },
  ],
  // TODO 其他数据自行添加
});

const getList = () => {
  data.loading = true;
  singinList(data.params)
    .then((res) => {
      data.list = res.data.records;
      data.total = res.data.total;
      data.loading = false;
    })
    .catch(() => {
      data.loading = false;
    });
};

getList();

/**
 * 选择条目
 */
const handleSelectionChange = (selection) => {
  data.selected.item = data.list.filter((item) => {
    return selection.indexOf(item.id) !== -1;
  });
  data.selected.multiple = selection.length;
};

const handleClear = () => {
  proxy.$modal.open({
    titleAlign: 'start',
    width: 300,
    title: () =>
      h('span', [
        h(resolveComponent('icon-exclamation-circle-fill')),
        h('span', '系统提示'),
      ]),
    content: () => h('p', { style: { margin: 0 } }, '确认要清空登录日志吗？'),
    onOk: () => {
      clear().then(() => {
        proxy.$message.success('清空成功');
        getList();
      });
    },
  });
};

const handleDelete = () => {
  let ids = data.selected.item.map((item) => item.id);
  proxy.$modal.open({
    titleAlign: 'start',
    width: 300,
    title: () =>
      h('span', [
        h(resolveComponent('icon-exclamation-circle-fill')),
        h('span', '系统提示'),
      ]),
    content: () =>
      h('p', { style: { margin: 0 } }, '确认要删除所选择的日志吗？'),
    onOk: () => {
      deleted(ids).then(() => {
        proxy.$message.success('删除成功');
        getList();
        proxy.$refs.tableRef.selectAll(false);
      });
    },
  });
};

const handleSearch = () => {
  data.params.pageNum = 1;
  getList();
};

const {
  list,
  loading,
  showSearch,
  selected,
  columns,
  params,
  pageSize,
  total,
} = toRefs(data);
</script>

<style lang="scss" scoped>
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

    .arco-col {
      :deep(.arco-table-cell) {
        .arco-btn {
          padding: 0;
        }
      }
    }
  }
}
</style>
