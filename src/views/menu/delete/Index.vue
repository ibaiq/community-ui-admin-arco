<template>
  <div>
    <div class="card">
      <a-row :gutter="[15, 15]">
        <!--搜索部分-->
        <a-col data-search :class="{ hiddenSearch: !showSearch }">
          <a-form ref="searchForm" :model="params" layout="inline" size="small">
            <a-form-item label="菜单名称" field="title">
              <a-input
                v-model="params.title"
                placeholder="请输入菜单名称"
                allow-clear
              />
            </a-form-item>
            <a-form-item label="路径地址" field="path">
              <a-input
                v-model="params.path"
                placeholder="请输入路径地址"
                allow-clear
              />
            </a-form-item>
            <a-form-item label="菜单属性" field="type">
              <a-select v-model="params.type" allow-clear placeholder="请选择">
                <a-option label="目录" :value="0">目录</a-option>
                <a-option label="菜单" :value="1">菜单</a-option>
                <a-option label="按钮" :value="2">按钮</a-option>
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
        <a-col>
          <a-row>
            <a-col :span="14">
              <a-space>
                <a-button type="primary" @click="handleAdd">
                  <template #icon>
                    <icon-plus />
                  </template>
                  新增
                </a-button>
                <a-button @click="handleExpansion">
                  <template #icon>
                    <icon-shrink v-if="table.expansionAll" />
                    <icon-expand v-else />
                  </template>
                  <span v-if="table.expansionAll">折叠</span>
                  <span v-else>展开</span>
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
        <a-col>
          <Table
            stripe
            border
            :loading="loading"
            :columns="columns"
            :data="list"
            :expansion-all="table.expansionAll"
            ref="tableRef"
          >
            <template #option>
              <a-table-column
                resizable
                :width="100"
                title="操作"
                align="center"
                key="option"
              >
                <template #cell="{ record }">
                  <a-space>
                    <el-button
                      type="primary"
                      link
                      size="small"
                      @click="handleRevert(record)"
                    >
                      <template #icon>
                        <icon-undo />
                      </template>
                      还原
                    </el-button>
                  </a-space>
                </template>
              </a-table-column>
            </template>
          </Table>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup name="Menu-delete">
import { useStore } from 'vuex';
import { getCurrentInstance, h, reactive, toRefs } from 'vue';
import { menuDelList } from '@/api/menu.js';
import RightToolbar from '@/components/rightToolbar/Index.vue';
import Table from './../components/table/Table.vue';
import getters from '@/store/getters.js';
import { delUser } from '@/api/user.js';

const { proxy } = getCurrentInstance();
const store = useStore();

const data = reactive({
  list: [],
  loading: true,
  showSearch: true,
  params: {
    // TODO 以下是每个页面需要的参数，自行添加
    title: undefined,
    path: undefined,
    type: undefined,
    system: undefined,
  },
  columns: [
    {
      label: '菜单名称',
      key: 'title',
      width: 150,
      tooltip: true,
    },
    {
      label: '路径',
      key: 'path',
      width: 150,
      tooltip: true,
    },
    {
      label: '图标',
      key: 'icon',
      align: 'center',
      width: 80,
      icon: true,
    },
    {
      label: '排序',
      key: 'sortNum',
      align: 'center',
      width: 80,
    },
    {
      label: '权限标识',
      key: 'perms',
      width: 120,
      tooltip: true,
    },
    {
      label: '组件地址',
      key: 'component',
      width: 150,
      tooltip: true,
    },
    {
      label: '可见',
      key: 'visible',
      align: 'center',
      width: 80,
      visTag: true,
    },
    {
      label: '属性',
      key: 'type',
      align: 'center',
      width: 80,
      typeTag: true,
    },
    {
      label: '类型',
      key: 'system',
      align: 'center',
      width: 120,
      sysTag: true,
    },
    {
      label: '创建时间',
      key: 'created',
      align: 'center',
      width: 175,
    },
  ],
  // TODO 其他数据自行添加
  table: {
    expansionAll: true,
  },
});

/**
 * 监听到有菜单删除自动刷新数据
 */
store.watch(getters.menuHaveDelete, (value) => {
  if (value) {
    getList();
    store.dispatch('user/setHaveDelete', false);
  }
});

const getList = () => {
  data.loading = true;
  menuDelList(data.params)
    .then((res) => {
      data.list = res.data;
      data.loading = false;
    })
    .catch(() => {
      data.loading = false;
    });
};

getList();

const handleRevert = (record) => {
  const getType = (type) => {
    return type === 0 ? '目录' : type === 1 ? '菜单' : '按钮';
  };
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
          h('span', '确认要还原删除的「'),
          h('b', `${record.title}`),
          h('span', `」「${getType(record.type)}」吗？`),
        ]
      ),
    width: 460,
    onOk: () => {
      delUser(userId).then(() => {
        proxy.$message.success('还原成功');
        if (data.list.length - userId.length === 0) {
          let copy_pageNum = data.params.pageNum;
          if (copy_pageNum - 1 > 0) {
            data.params.pageNum -= 1;
          }
        }
        getList();
        store.dispatch('menu/setHaveRevert', true);
      });
    },
    onCancel: () => {},
  });
};

const { list, loading, showSearch, params, columns, modal, table } =
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
  }
}
</style>
