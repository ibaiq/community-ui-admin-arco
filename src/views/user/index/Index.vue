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
                <a-button type="primary" @click="handleAdd">
                  <template #icon>
                    <icon-plus />
                  </template>
                  新增
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
            @row-contextmenu="rightClick"
          >
            <template #option>
              <el-table-column
                resizable
                align="center"
                label="操作"
                key="option"
                :min-width="180"
                v-slot="{ row }"
              >
                <a-space>
                  <el-button
                    link
                    type="primary"
                    icon="Edit"
                    size="small"
                    @click="handleUpdate(row)"
                    >修改
                  </el-button>
                  <el-button
                    link
                    type="danger"
                    icon="Delete"
                    size="small"
                    style="color: #f56c6c"
                    @click="handleDelete(row)"
                    >删除
                  </el-button>
                  <el-dropdown trigger="click" size="small">
                    <el-button link icon="DArrowRight" size="small"
                      >更多
                    </el-button>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item
                          icon="CircleCheck"
                          @mouseup="handleAuthRole(row)"
                        >
                          分配角色
                        </el-dropdown-item>
                        <el-dropdown-item
                          icon="key"
                          @mouseup="handleResetPwd(row)"
                        >
                          重置密码
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
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
    <AddAndUpdate
      v-if="modal.AddAndUpdate.open"
      :window="modal.AddAndUpdate"
      @refresh="getList"
    />
  </div>
</template>

<script setup name="User-index">
import { getCurrentInstance, h, reactive, resolveComponent, toRefs } from 'vue';
import {
  delUser,
  getUser,
  modifyStatus,
  resetPwd,
  userList,
} from '@/api/user.js';
import { isExternal } from '@/utils/validate.js';
import { useStore } from 'vuex';
import AddAndUpdate from './components/modal/AddAndUpdate.vue';
import Table from './components/table/Table.vue';
import RightToolbar from '@/components/rightToolbar/Index.vue';
import Pagination from '@/components/pagination/Index.vue';
import { getConfValue } from '@/api/config.js';
import getters from '@/store/getters.js';
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
  rightMenu: {
    visible: false,
    record: null,
    options: [
      {
        type: 'li',
        text: '修改',
      },
    ],
  },
});

/**
 * 监听到有恢复用户自动刷新数据
 */
store.watch(getters.haveRevert, (value) => {
  if (value) {
    getList();
    store.dispatch('user/setHaveRevert', false);
  }
});

/**
 * 获取展示数据列表
 */
const getList = () => {
  data.loading = true;
  userList(data.params)
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
 * 重置表单
 */
const reset = () => {
  data.modal.AddAndUpdate.row = {
    id: undefined,
    username: undefined,
    nickname: undefined,
    password: undefined,
    sex: '0',
    status: true,
  };
};

/**
 * 转换返回的json
 * @param user
 * @returns {{password: *, sex: *, nickname: *, id, username: *, status}}
 */
const convert = (user) => {
  return {
    id: user.id,
    username: user.username,
    nickname: user.nickname,
    password: user.password,
    sex: user.sex,
    status: user.status,
  };
};

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
 * 添加用户
 */
const handleAdd = () => {
  reset();
  data.modal.AddAndUpdate.title = '添加用户';
  data.modal.AddAndUpdate.rules = {
    username: [
      { required: true, message: '用户名不能为空' },
      {
        minLength: 4,
        maxLength: 18,
        message: '用户名长度必须介于 4 至 18 个字符之间',
      },
    ],
    nickname: [
      { required: true, message: '昵称不能为空', trigger: 'blur' },
      {
        min: 2,
        max: 18,
        message: '昵称长度必须介于 2 至 18 个字符之间',
        trigger: 'blur',
      },
    ],
    password: [
      { required: true, message: '密码不能为空' },
      {
        minLength: 5,
        maxLength: 18,
        message: '密码长度必须介于 5 至 18 个字符之间',
      },
    ],
  };
  data.modal.AddAndUpdate.open = true;
};

/**
 * 修改用户
 */
const handleUpdate = (row) => {
  reset();
  data.modal.AddAndUpdate.title = '修改用户';
  data.modal.AddAndUpdate.rules = {
    username: [
      { required: true, message: '用户名不能为空' },
      {
        minLength: 4,
        maxLength: 18,
        message: '用户名长度必须介于 4 至 18 个字符之间',
      },
    ],
  };
  getUser(row.id).then((res) => {
    data.modal.AddAndUpdate.row = convert(res.data);
    data.modal.AddAndUpdate.open = true;
  });
};

/**
 * 删除用户
 */
const handleDelete = (row) => {
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
          h('span', '确认要删除「'),
          h('b', `${username}`),
          h('span', '」用户吗？'),
        ]
      ),
    width: 460,
    onOk: () => {
      delUser(userId).then(() => {
        proxy.$message.success('删除成功');
        if (data.list.length - userId.length === 0) {
          let copy_pageNum = data.params.pageNum;
          if (copy_pageNum - 1 > 0) {
            data.params.pageNum -= 1;
          }
        }
        getList();
        store.dispatch('user/setHaveDelete', true);
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

/**
 * 重置用户密码
 * @param user
 */
const handleResetPwd = (user) => {
  let username = user.username;
  proxy.$modal.open({
    titleAlign: 'start',
    width: 450,
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
          h('span', '确定要重置「'),
          h('b', username),
          h('span', '」用户的密码吗？'),
        ]
      ),
    onOk: () => {
      resetPwd({ id: user.id }).then(() => {
        getConfValue('sys.user.initPwd').then((res) => {
          proxy.$notification.success({
            title: '重置成功',
            duration: 0,
            closable: true,
            content: h(
              'p',
              {
                style: {
                  margin: 0,
                },
              },
              [
                h('span', '用户「'),
                h('b', user.username),
                h('span', '」，新密码：「'),
                h('b', res.data),
                h('span', '」，告知用户尽快修改密码'),
              ]
            ),
          });
        });
      });
    },
  });
};

const handleAuthRole = (user) => {
  router.push({ name: 'User-auth-role', params: { userId: user.id } });
};

const rightClick = (visible, record) => {
  data.rightMenu.record = record;
  data.rightMenu.visible = visible;
};

const selectOpt = (value) => {
  switch (value) {
    case 'modify':
      handleUpdate(data.rightMenu.record);
      break;
    case 'delete':
      handleDelete(data.rightMenu.record);
      break;
    case 'auth-role':
      handleAuthRole(data.rightMenu.record);
      break;
    case 'reset-pwd':
      handleResetPwd(data.rightMenu.record);
      break;
  }
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
  modal,
  rightMenu,
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

.contextmenu {
  box-sizing: border-box;
  padding: 4px 0;
  background-color: var(--color-bg-popup);
  border: 1px solid var(--color-fill-3);
  border-radius: var(--border-radius-medium);
  box-shadow: 0 4px 10px rgb(0 0 0 / 10%);

  ul {
    padding: 0;
    margin: 0;
  }

  li {
    list-style: none;
    padding: 0 10px;
  }
}
</style>
