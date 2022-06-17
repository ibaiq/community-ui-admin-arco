<template>
  <div>
    <div class="card">
      <a-row :gutter="[10, 10]">
        <!--数据展示部分-->
        <a-col>
          <a-table
            stripe
            v-if="data.list.length > 0"
            :bordered="{ wrapper: true, cell: true }"
            :loading="data.loading"
            :data="data.list"
            row-key="id"
            ref="tableRef"
            :pagination="false"
          >
            <template #columns>
              <a-table-column
                v-for="item in data.columns"
                :title="item.label"
                :data-index="item.key"
                :align="item.align"
                :width="item.width"
                :ellipsis="item.tooltip"
                :sortable="item.sortable"
              >
                <template #cell="{ record }">
                  <a-avatar v-if="item.img">
                    <img :src="record.avatar" alt="" />
                  </a-avatar>
                  <a-switch
                    v-else-if="item.switch"
                    v-model="record.status"
                    @change="handleStatusChange($event, record)"
                  >
                    <template #checked-icon>
                      <icon-check />
                    </template>
                    <template #unchecked-icon>
                      <icon-close />
                    </template>
                  </a-switch>
                  <template v-else-if="item.tag">
                    <a-tag v-if="record[item.key] === '0'" color="gray">
                      未知
                    </a-tag>
                    <a-tag v-else-if="record[item.key] === '1'" color="blue">
                      <icon-man />
                      男
                    </a-tag>
                    <a-tag v-else-if="record[item.key] === '2'" color="magenta">
                      <icon-woman />
                      女
                    </a-tag>
                  </template>
                  <a-tooltip
                    mini
                    v-else-if="item.tooltip"
                    :content="record[item.key]"
                  >
                    <span>{{ record[item.key] }}</span>
                  </a-tooltip>
                  <span v-else>{{ record[item.key] }}</span>
                </template>
              </a-table-column>
              <a-table-column :width="100" align="center" title="操作">
                <template #cell="{ record }">
                  <el-button
                    type="text"
                    size="small"
                    @click="handleDelete(record)"
                  >
                    <template #icon>
                      <icon-export />
                    </template>
                    强退
                  </el-button>
                </template>
              </a-table-column>
            </template>
          </a-table>
          <a-empty v-else />
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup name="Online-index">
import { getCurrentInstance, h, reactive, resolveComponent, toRefs } from 'vue';
import { onlineList, retreat } from '@/api/online.js';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const { proxy } = getCurrentInstance();
const store = useStore();
const router = useRouter();

const data = reactive({
  list: [],
  loading: true,
  total: 0,
  pageSize: [5, 10, 15, 50, 100],
  showSearch: true,
  params: {
    pageNum: 1,
    pageSize: 10,
    // TODO 以下是每个页面需要的参数，自行添加
  },
  columns: [
    {
      key: 'uuid',
      label: `编号`,
      visible: true,
      width: 200,
    },
    {
      key: 'username',
      label: `用户名`,
      visible: true,
      align: 'center',
      width: 120,
      tooltip: true,
    },
    {
      key: 'ip',
      label: `登录地址`,
      visible: true,
      align: 'center',
      width: 120,
      tooltip: true,
    },
    {
      key: 'loginLocation',
      label: `登录地址`,
      visible: true,
      align: 'center',
      width: 120,
      tooltip: true,
    },
    {
      key: 'os',
      label: `操作系统`,
      visible: true,
      align: 'center',
      width: 120,
    },
    {
      key: 'browser',
      label: `浏览器`,
      visible: true,
      align: 'center',
      width: 120,
    },
    {
      key: 'loginTime',
      label: `登录时间`,
      visible: true,
      align: 'center',
      width: 170,
      sortable: {
        sortDirections: ['ascend', 'descend'],
      },
    },
  ],
  // TODO 其他数据自行添加
  modal: {
    AddAndUpdate: {
      open: false,
      title: '',
      row: {},
      rules: {},
    },
    authRole: {
      open: false,
      title: '授权角色',
      roleList: [],
      user: {},
    },
  },
  initPwd: '',
});

/**
 * 获取展示数据列表
 */
const getList = () => {
  data.loading = true;
  onlineList(data.params)
    .then((res) => {
      data.list = res.data.records;
      data.total = res.data.total;
      data.loading = false;
    })
    .catch((err) => {
      data.emptyText = err.msg;
      data.loading = false;
    });
};

getList();

/**
 * 删除用户
 */
const handleDelete = (row) => {
  let uuid = row.uuid;
  proxy.$modal.open({
    titleAlign: 'start',
    title: () =>
      h('span', [
        h(resolveComponent('icon-exclamation-circle-fill')),
        h('span', '系统提示'),
      ]),
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
          h('span', '确认要强制退出「'),
          h('b', `${row.username}`),
          h('span', '」用户吗？'),
        ]
      ),
    escToClose: true,
    closable: true,
    width: 460,
    mask: true,
    onOk: () => {
      retreat(uuid).then(() => {
        proxy.$message.success('强制退出成功');
        if (data.list.length - 1) {
          let copy_pageNum = data.params.pageNum;
          if (copy_pageNum - 1 > 0) {
            data.params.pageNum -= 1;
          }
        }
        getList();
      });
    },
    onCancel: () => {},
  });
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

const {} = toRefs(data);
</script>

<style scoped></style>
