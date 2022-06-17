<template>
  <div>
    <div class="card">
      <a-row :gutter="[10, 10]">
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
              <right-toolbar v-model:show-search="showSearch" />
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="24">
          <a-spin :loading="loading" style="display: block">
            <a-row :gutter="[10, 15]">
              <a-col
                v-for="item in list"
                :xs="24"
                :sm="24"
                :lg="24 / 2"
                :md="24 / 2"
                :xl="24 / 4"
                :xxl="24 / 4"
              >
                <a-card hoverable size="small" :key="item.id">
                  <div class="config-card-title">
                    <div class="config-title-left">
                      <span style="margin-right: 10px">
                        {{ item.configName }}
                      </span>
                    </div>
                  </div>
                  <div class="config-card-description">
                    {{ item.remark }}
                  </div>
                  <div class="config-card-content">
                    <div class="config-item">
                      <label>配置类型</label>
                      <a-tag v-if="item.configType" color="green" size="small">
                        系统内置
                      </a-tag>
                      <a-tag v-else color="blue" size="small">普通配置</a-tag>
                    </div>
                    <div class="config-item">
                      <label>配置键</label>
                      <a-tag color="orangered" size="small">
                        {{ item.configKey }}
                      </a-tag>
                    </div>
                    <div class="config-item">
                      <label>创建者</label>
                      <a-tag size="small" color="purple">
                        {{ item.createBy }}
                      </a-tag>
                    </div>
                    <div class="config-item">
                      <label>创建时间</label>
                      <a-tag size="small" color="pinkpurple">
                        {{ item.created }}
                      </a-tag>
                    </div>
                  </div>
                </a-card>
              </a-col>
            </a-row>
          </a-spin>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup name="Config-index">
import RightToolbar from '@/components/rightToolbar/Index.vue';
import { reactive, toRefs } from 'vue';
import { configList } from '@/api/config.js';

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
  columns: [],
  // TODO 其他数据自行添加
  modal: {
    // 添加与修改窗口需要参数
    am: {
      open: false,
      title: '',
      config: {},
    },
  },
});

/**
 * 获取展示数据列表
 */
const getList = () => {
  data.loading = true;
  configList(data.params)
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

const { list, loading, showSearch } = toRefs(data);
</script>

<style lang="scss" scoped>
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

    .config-card-title {
      color: var(--color-text-1);
      font-weight: 500;
      display: flex;
      justify-content: space-between;
      position: relative;

      .config-title-left {
        margin-right: 20px;
      }

      .config-title-right {
        height: fit-content;
        display: flex;

        .arco-btn {
          color: var(--color-text-1);
          font-size: 18px;
        }
      }
    }

    .config-card-subtitle {
      color: var(--color-text-3);
      font-weight: 400;
      font-size: 12px !important;
    }

    .config-card-description {
      font-size: 14px;
    }

    .config-card-content {
      .config-item {
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
</style>
