<template>
  <!--PC端-->
  <a-modal
    v-if="store.getters.device !== 'mobile'"
    v-model:visible="modal.open"
    title-align="start"
    title="角色详情"
    hide-cancel
    :width="800"
    :modal-class="modal.authUserList.length > 6 ? 'role-modal' : ''"
  >
    <div class="modal-role-info">
      <div class="modal-role-title">
        <div class="modal-role-title-left">
          <span>{{ modal.role.title }}</span>
          <div class="modal-role-subtitle">
            <span>{{ modal.role.name }}</span>
          </div>
        </div>
      </div>
      <div class="modal-role-description">
        <span>{{ modal.role.description }}</span>
      </div>
      <div class="modal-role-content">
        <a-row :gutter="[10, 10]">
          <a-col :span="12">
            <div class="modal-role-item">
              <label>编号</label>
              <a-tag
                :color="
                  colorList[parseInt(Math.random() * (colorList.length - 1))]
                "
                >{{ modal.role.id }}
              </a-tag>
            </div>
          </a-col>
          <a-col :span="12">
            <div class="modal-role-item">
              <label>类型</label>
              <div>
                <a-tag v-if="modal.role.type" color="arcoblue">系统内置</a-tag>
                <a-tag v-else color="purple">普通角色</a-tag>
              </div>
            </div>
          </a-col>
          <a-col :span="12">
            <div class="modal-role-item">
              <label>状态</label>
              <div>
                <a-tag v-if="modal.role.status" color="green">正常</a-tag>
                <a-tag v-else color="red">禁用</a-tag>
              </div>
            </div>
          </a-col>
          <a-col :span="12">
            <div class="modal-role-item">
              <label>创建时间</label>
              <div>
                <a-tag color="blue">{{ modal.role.created }}</a-tag>
              </div>
            </div>
          </a-col>
          <a-col :span="12">
            <div class="modal-role-item">
              <label>更新时间</label>
              <div>
                <a-tag color="orangered"
                  >{{ modal.role.updated || '暂无' }}
                </a-tag>
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
      <div class="modal-auth-user-list">
        <a-row v-if="modal.authUserList.length > 0" :gutter="15">
          <a-col :span="24 / 6" v-for="item in modal.authUserList">
            <a-tooltip :content="'用户名：' + item.username">
              <div class="el-card is-always-shadow">
                <a-avatar :size="50">
                  <img :src="item.avatar" alt="" />
                </a-avatar>
                <h3>{{ item.nickname }}</h3>
              </div>
            </a-tooltip>
          </a-col>
        </a-row>
        <a-empty description="暂无授权用户" v-else />
      </div>
    </div>
    <template #footer>
      <a-button @click="handleCloseModal">关闭</a-button>
    </template>
  </a-modal>
  <!--移动端-->
  <a-modal
    v-else
    v-model:visible="modal.open"
    title-align="start"
    title="角色详情"
    hide-cancel
    width="100%"
    fullscreen
    modal-class="dialog-mobile"
  >
    <div class="modal-role-info">
      <div class="modal-role-title">
        <div class="modal-role-title-left">
          <span>{{ modal.role.title }}</span>
          <div class="modal-role-subtitle">
            <span>{{ modal.role.name }}</span>
          </div>
        </div>
      </div>
      <div class="modal-role-description">
        <span>{{ modal.role.description }}</span>
      </div>
      <div class="modal-role-content">
        <a-row :gutter="[10, 10]">
          <a-col :span="8">
            <div class="modal-role-item">
              <label>编号</label>
              <a-tag
                :color="
                  colorList[parseInt(Math.random() * (colorList.length - 1))]
                "
                >{{ modal.role.id }}
              </a-tag>
            </div>
          </a-col>
          <a-col :span="8">
            <div class="modal-role-item">
              <label>类型</label>
              <div>
                <a-tag v-if="modal.role.type" color="arcoblue">系统内置</a-tag>
                <a-tag v-else color="purple">普通角色</a-tag>
              </div>
            </div>
          </a-col>
          <a-col :span="8">
            <div class="modal-role-item">
              <label>状态</label>
              <div>
                <a-tag v-if="modal.role.status" color="green">正常</a-tag>
                <a-tag v-else color="red">禁用</a-tag>
              </div>
            </div>
          </a-col>
          <a-col :span="24">
            <div class="modal-role-item">
              <label>创建时间</label>
              <div>
                <a-tag color="blue">{{ modal.role.created }}</a-tag>
              </div>
            </div>
          </a-col>
          <a-col :span="24">
            <div class="modal-role-item">
              <label>更新时间</label>
              <div>
                <a-tag color="orangered"
                  >{{ modal.role.updated || '暂无' }}
                </a-tag>
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
      <div class="modal-auth-user-list">
        <a-row v-if="modal.authUserList.length > 0" :gutter="15">
          <a-col :span="24 / 3" v-for="item in modal.authUserList">
            <a-tooltip :content="'用户名：' + item.username">
              <div class="el-card is-always-shadow">
                <a-avatar :size="50">
                  <img :src="item.avatar" alt="" />
                </a-avatar>
                <h3>{{ item.nickname }}</h3>
              </div>
            </a-tooltip>
          </a-col>
        </a-row>
        <a-empty description="暂无授权用户" v-else />
      </div>
    </div>
    <template #footer>
      <a-button @click="handleCloseModal">关闭</a-button>
    </template>
  </a-modal>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';

const props = defineProps({
  modal: {
    type: Object,
    required: true,
  },
});

const store = useStore();
const colorList = ref([
  'red',
  'orangered',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'arcoblue',
  'purple',
  'pinkpurple',
  'magenta',
  'gray',
]);

const handleCloseModal = () => {
  props.modal.role = {};
  props.modal.open = false;
};
</script>

<style lang="scss" scoped>
.modal-role-info {
  height: 100%;
  padding: 10px;
  margin: -10px;
  overflow: hidden;

  div:not(:last-child) {
    margin-bottom: 15px;
  }

  .modal-role-title {
    color: var(--color-text-1);
    font-weight: 500;
    display: flex;
    justify-content: space-between;
    position: relative;

    .modal-role-title-left {
      margin-right: 20px;
    }

    .modal-role-subtitle {
      color: var(--color-text-3);
      font-weight: 400;
      font-size: 12px !important;
    }

    .modal-role-title-right {
      height: fit-content;
      display: flex;
    }
  }

  .modal-role-description {
    font-size: 12px;
  }

  .modal-role-content {
    .modal-role-item {
      display: flex;
      align-items: center;

      label {
        font-size: 12px;
        margin-right: 8px;
        color: var(--color-text-3);
      }
    }
  }

  .modal-auth-user-list {
    padding: 10px;
    margin: 0 -10px -10px;
    height: calc(100% - 218px);
    overflow: auto;

    .arco-row {
    }

    .el-card {
      border: none;
      display: grid;
      place-items: center;
      //--el-card-padding: 20px 15px 15px;
      padding: 20px 15px 15px;
      overflow: hidden;

      h3 {
        justify-content: center;
        margin: 0;
        width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        text-align: center;
        font-weight: 500;
        color: var(--color-text-2);
      }
    }
  }
}
</style>
