<template>
  <div>
    <div class="card">
      <a-row :gutter="[10, 10]">
        <!--搜索部分-->
        <a-col
          :span="24"
          data-search
          :class="{ hiddenSearch: !data.showSearch }"
        >
          <a-form
            ref="searchRef"
            :model="data.params"
            layout="inline"
            size="small"
          >
            <a-form-item label="角色名称" field="title">
              <a-input
                v-model="data.params.title"
                placeholder="请输入角色名称"
                allow-clear
              />
            </a-form-item>
            <a-form-item label="标识" field="name">
              <a-input
                v-model="data.params.name"
                placeholder="请输入标识"
                allow-clear
              />
            </a-form-item>
            <a-form-item label="状态" field="status">
              <a-select
                v-model="data.params.status"
                clearable
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
              </a-space>
            </a-col>
            <a-col :span="10">
              <RightToolbar
                v-model:show-search="data.showSearch"
                @refresh="getList"
              />
            </a-col>
          </a-row>
        </a-col>
        <!--数据展示部分-->
        <a-col :span="24">
          <a-row :gutter="[10, 15]">
            <a-col
              v-for="item in data.list"
              :xs="24"
              :sm="24"
              :lg="24 / 2"
              :md="24 / 2"
              :xl="24 / 4"
              :xxl="24 / 4"
            >
              <a-card
                hoverable
                size="small"
                :key="item.id"
                @click="handleInfo(item.id)"
              >
                <div class="role-card-title">
                  <div class="role-title-left">
                    <span>{{ item.title }}</span>
                    <div class="role-card-subtitle">
                      <span>{{ item.name }}</span>
                    </div>
                  </div>
                  <div class="role-title-right">
                    <a-space>
                      <a-tooltip mini content="删除">
                        <a-button
                          type="text"
                          size="small"
                          @click.stop="handleDelete(item)"
                        >
                          <template #icon>
                            <icon-delete />
                          </template>
                        </a-button>
                      </a-tooltip>
                      <a-tooltip mini content="权限">
                        <a-button
                          type="text"
                          size="small"
                          @click.stop="handlePermits(item)"
                        >
                          <template #icon>
                            <icon-font type="icon-quanxianguanli2" />
                          </template>
                        </a-button>
                      </a-tooltip>
                      <a-tooltip mini content="修改">
                        <a-button
                          type="text"
                          size="small"
                          @click.stop="handleUpdate(item.id)"
                        >
                          <template #icon>
                            <icon-edit />
                          </template>
                        </a-button>
                      </a-tooltip>
                    </a-space>
                  </div>
                </div>
                <div class="role-card-description">
                  <span>{{ item.description }}</span>
                </div>
                <div class="role-card-content">
                  <div class="role-item">
                    <label>类型</label>
                    <div>
                      <a-tag v-if="item.type" color="arcoblue">系统内置</a-tag>
                      <a-tag v-else color="purple">普通角色</a-tag>
                    </div>
                  </div>
                  <div class="role-item">
                    <label>状态</label>
                    <div>
                      <a-tag v-if="item.status" color="green">正常</a-tag>
                      <a-tag v-else color="red">禁用</a-tag>
                    </div>
                  </div>
                  <div class="role-item">
                    <label>创建时间</label>
                    <div>
                      <a-tag color="blue">{{ item.created }}</a-tag>
                    </div>
                  </div>
                  <div class="role-item">
                    <label>更新时间</label>
                    <div>
                      <a-tag color="orangered"
                        >{{ item.updated || '暂无' }}
                      </a-tag>
                    </div>
                  </div>
                </div>
              </a-card>
            </a-col>
          </a-row>
        </a-col>
        <!--分页部分-->
        <a-col :span="24">
          <Pagination
            v-show="data.total > 0"
            :total="data.total"
            v-model:page="data.params.pageNum"
            v-model:limit="data.params.pageSize"
            :page-size="data.pageSize"
            @callback="getList"
          />
        </a-col>
      </a-row>
    </div>
    <!--对话框部分-->
    <info :modal="data.modal.info" />
    <add-and-modify @refresh="getList" :modal="data.modal.edit" />
    <select-menu :modal="data.modal.menu" />
  </div>
</template>

<script setup name="Role-index">
import { getCurrentInstance, reactive } from 'vue';
import { useStore } from 'vuex';
import Pagination from '@/components/pagination/Index.vue';
import {
  deleteRole,
  getRole,
  getRoleAuthUser,
  getRoleMenuList,
  roleList,
} from '@/api/role.js';
import RightToolbar from '@/components/rightToolbar/Index.vue';
import Info from './components/modal/Info.vue';
import AddAndModify from './components/modal/AddAndModify.vue';
import SelectMenu from './components/modal/SelectMenu.vue';
import { isExternal } from '@/utils/validate.js';
import { menuList } from '@/api/menu.js';

const { proxy } = getCurrentInstance();
const store = useStore();

const data = reactive({
  list: [],
  loading: true,
  emptyText: '暂无数据',
  total: 0,
  pageSize: [5, 10, 15, 50, 100],
  showSearch: true,
  searchBox: null,
  params: {
    pageNum: 1,
    pageSize: 10,
    // TODO 以下是每个页面需要的参数，自行添加
    title: undefined,
    name: undefined,
    status: undefined,
  },
  // TODO 其他数据自行添加
  modal: {
    info: {
      open: false,
      authUserList: [],
      pageNum: 1,
      pageSize: 10,
      role: {},
    },
    edit: {
      open: false,
      title: '',
      role: {},
      rules: {
        title: [
          { required: true, message: '角色名称不能为空' },
          {
            minLength: 2,
            maxLength: 20,
            message: '用户名长度必须介于 2 至 20 个字符之间',
          },
        ],
        name: [
          { required: true, message: '唯一标识不能为空' },
          {
            minLength: 2,
            maxLength: 20,
            message: '用户名长度必须介于 2 至 20 个字符之间',
          },
        ],
      },
    },
    menu: {
      open: false,
      menuList: [],
      authMenu: [],
      menuIds: [],
      roleId: undefined,
    },
  },
});

/**
 * 获取展示数据列表
 */
const getList = () => {
  data.loading = true;
  roleList(data.params)
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
 * 重置弹窗表单
 * @returns {{name: undefined, description: undefined, title: undefined, type: boolean, status: boolean}}
 */
const reset = () => {
  data.modal.edit.role = {
    title: undefined,
    name: undefined,
    type: false,
    status: true,
    description: undefined,
  };
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
    title: '',
    name: '',
    status: '',
  };
  proxy.$refs.searchRef.resetFields();
  handleSearch();
};

/**
 * 添加角色
 */
const handleAdd = () => {
  reset();
  data.modal.edit.title = '添加角色';
  data.modal.edit.open = true;
};

/**
 * 查看角色详情
 * @param id
 */
const handleInfo = (id) => {
  getRole(id).then((res) => {
    data.modal.info.role = res.data;
    getRoleAuthUser(id).then((authUser) => {
      authUser.data.records.forEach((user) => {
        if (!isExternal(user.avatar)) {
          user.avatar = import.meta.env.VITE_APP_BASE_API + user.avatar;
        }
      });
      data.modal.info.authUserList = authUser.data.records;
      data.modal.info.open = true;
    });
  });
};

/**
 * 修改角色信息
 * @param id
 */
const handleUpdate = (id) => {
  data.modal.edit.title = '修改角色';
  getRole(id).then((res) => {
    delete res.data.created;
    delete res.data.updated;
    data.modal.edit.role = res.data;
    data.modal.edit.open = true;
  });
};

/**
 * 删除角色
 * @param role
 */
const handleDelete = (role) => {
  let title = role.title;
  let name = role.name;
  proxy
    .$alert(
      '确认要删除 "<b>' + title + '</b>" ' + '「' + name + '」' + '角色吗？',
      '系统提示',
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showCancelButton: true,
        closeOnClickModal: true,
        type: 'warning',
      }
    )
    .then(() => {
      deleteRole([role.id]).then(() => {
        proxy.$message.success('删除成功');
        getList();
      });
    })
    .catch(() => {});
};

const handlePermits = (role) => {
  data.modal.menu.roleId = role.id;
  menuList().then((res) => {
    // data.modal.menu.menuList = treeList(res.data);
    data.modal.menu.menuList = res.data;
    getRoleMenuList(role.id).then((res) => {
      data.modal.menu.authMenu = res.data;
      data.modal.menu.open = true;
    });
  });
};

const treeList = (list) => {
  let tree = [];
  list.forEach((item) => {
    let data = {
      key: item.id,
      title: item.title,
      children: undefined,
    };
    if (item.children) {
      data.children = treeList(item.children);
    }
    tree.push(data);
  });
  return tree;
};
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
}

.arco-row {
  .arco-form-item {
    :deep(.arco-select-view-single) {
      width: 6rem;
    }

    :deep(.arco-input-wrapper) {
      width: 10rem;
    }
  }

  .arco-card {
    color: var(--color-text-2);
    border-radius: 4px;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-4px);
    }

    div:not(:last-child) {
      margin-bottom: 12px;
    }

    .role-card-title {
      color: var(--color-text-1);
      font-weight: 500;
      display: flex;
      justify-content: space-between;
      position: relative;

      .role-title-left {
        margin-right: 20px;
      }

      .role-title-right {
        height: fit-content;
        display: flex;

        .arco-btn {
          color: var(--color-text-1);
          font-size: 18px;
        }
      }
    }

    .role-card-subtitle {
      color: var(--color-text-3);
      font-weight: 400;
      font-size: 12px !important;
    }

    .role-card-description {
      font-size: 12px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .role-card-content {
      .role-item {
        display: flex;
        align-items: center;

        label {
          font-size: 12px;
          margin-right: 8px;
          color: var(--color-text-3);
        }
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

:deep(.el-pagination) {
  --el-pagination-bg-color: transparent;
  --el-pagination-button-bg-color: transparent;
  --el-pagination-button-disabled-bg-color: transparent;
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
