<template>
  <div>
    <div class="card">
      <a-row :gutter="[10, 10]">
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
              </a-space>
            </a-col>
            <a-col :span="10">
              <right-toolbar :columns="columns" @refresh="getList" />
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
            row-key="id"
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
                :tooltip="item.ellipsis"
              >
                <template #cell="{ record }">
                  <template v-if="item.statusTag">
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

<script setup name="Log-access">
import { getCurrentInstance, reactive, toRefs, h, resolveComponent } from 'vue';
import Pagination from '@/components/pagination/Index.vue';
import RightToolbar from '@/components/rightToolbar/Index';
import { accessList, clear } from '@/api/access.js';

const { proxy } = getCurrentInstance();

const data = reactive({
  list: [],
  total: 0,
  loading: true,
  pageSize: [5, 10, 15, 50, 100],
  showSearch: true,
  params: {
    pageNum: 1,
    pageSize: 15,
    // TODO 以下是每个页面需要的参数，自行添加
  },
  columns: [
    {
      dataIndex: 'username',
      title: '访问用户',
      align: 'center',
      width: 120,
    },
    {
      dataIndex: 'ip',
      title: '用户主机',
      align: 'center',
      width: 120,
    },
    {
      dataIndex: 'url',
      title: '访问地址',
      align: 'center',
      width: 150,
      ellipsis: true,
    },
    {
      dataIndex: 'location',
      title: '用户地址',
      align: 'center',
      width: 150,
    },
    {
      dataIndex: 'time',
      title: '访问时间',
      align: 'center',
      width: 180,
      sortable: {
        sortDirections: ['ascend', 'descend'],
      },
    },
  ],
  // TODO 其他数据自行添加
});

const getList = () => {
  data.loading = true;
  accessList(data.params)
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

const handleClear = () => {
  proxy.$modal.open({
    titleAlign: 'start',
    width: 400,
    title: () =>
      h('span', [
        h(resolveComponent('icon-exclamation-circle-fill')),
        h('span', '系统提示'),
      ]),
    content: () => h('p', { style: { margin: 0 } }, '确认要清空访问日志吗？'),
    onOk: () => {
      clear().then(() => {
        proxy.$message.success('清空成功');
        getList();
      });
    },
  });
};

const { list, loading, showSearch, columns, params, pageSize, total } =
  toRefs(data);
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
