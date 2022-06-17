<template>
  <div>
    <a-row :gutter="[15, 15]">
      <a-col :span="24">
        <div class="card">
          <div class="card-avatar">
            <a-avatar :size="60">
              <img :src="store.getters.user.avatar" alt="" />
            </a-avatar>
          </div>
          <div class="card-content">
            <h3>
              {{ data.thisTime }}
              {{ store.getters.user.nickname }}，愿你天黑有灯，下雨有伞。
            </h3>
            <p>{{ store.getters.sentence }}</p>
          </div>
        </div>
      </a-col>
      <a-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" :xxl="12">
        <a-row :gutter="[15, 15]">
          <a-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" :xxl="12">
            <a-spin :loading="data.loading">
              <el-card shadow="hover">
                <a-statistic
                  :value="data.userCount"
                  show-group-separator
                  :value-from="0"
                  animation
                  :animation-duration="3000"
                  separator=","
                >
                  <template #title>用户数量</template>
                  <template #prefix>
                    <icon-user style="margin-right: 5px" :size="22" />
                  </template>
                  <template #suffix>
                    <icon-arrow-rise />
                  </template>
                </a-statistic>
              </el-card>
            </a-spin>
          </a-col>
          <a-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" :xxl="12">
            <el-card shadow="hover"></el-card>
          </a-col>
        </a-row>
      </a-col>
      <a-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" :xxl="12">
        <a-row :gutter="[15, 15]">
          <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" :xxl="12">
            <el-card shadow="hover"></el-card>
          </a-col>
          <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" :xxl="12">
            <el-card shadow="hover"></el-card>
          </a-col>
        </a-row>
      </a-col>
      <!--<a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">-->
      <!--  <el-card shadow="hover">-->
      <!--    <template #header>-->
      <!--      <span><icon-info-circle-fill /> 信息</span>-->
      <!--      <el-tag>部署时间：{{ data.buildTime }}</el-tag>-->
      <!--    </template>-->
      <!--    <div class="version-information-table">-->
      <!--      <table>-->
      <!--        <tr>-->
      <!--          <td>vue</td>-->
      <!--          <td>{{ dependencies['vue'] }}</td>-->
      <!--          <td>arco-design</td>-->
      <!--          <td>{{ devDependencies['@arco-design/web-vue'] }}</td>-->
      <!--        </tr>-->
      <!--        <tr>-->
      <!--          <td>vite</td>-->
      <!--          <td>{{ devDependencies['vite'] }}</td>-->
      <!--          <td>@vitejs/plugin-vue</td>-->
      <!--          <td>{{ devDependencies['@vitejs/plugin-vue'] }}</td>-->
      <!--        </tr>-->
      <!--        <tr>-->
      <!--          <td>vue-router</td>-->
      <!--          <td>{{ dependencies['vue-router'] }}</td>-->
      <!--          <td>axios</td>-->
      <!--          <td>{{ dependencies['axios'] }}</td>-->
      <!--        </tr>-->
      <!--        <tr>-->
      <!--          <td>vuex</td>-->
      <!--          <td>{{ dependencies['vuex'] }}</td>-->
      <!--          <td>js-base64</td>-->
      <!--          <td>{{ dependencies['js-base64'] }}</td>-->
      <!--        </tr>-->
      <!--      </table>-->
      <!--    </div>-->
      <!--  </el-card>-->
      <!--</a-col>-->
    </a-row>
  </div>
</template>

<script setup name="Manage-index">
import { onBeforeMount, onMounted, reactive } from 'vue';
import { useStore } from 'vuex';
// import { dependencies, devDependencies } from '../../../package.json';
import { getUserCount } from '@/api/user.js';

const store = useStore();
const data = reactive({
  thisTime: '',
  buildTime: '',
  userCount: undefined,
  loading: true,
});

onBeforeMount(() => {
  const hour = new Date().getHours();
  data.thisTime =
    hour < 8
      ? '早上好'
      : hour <= 11
      ? '上午好'
      : hour <= 13
      ? '中午好'
      : hour < 18
      ? '下午好'
      : '晚上好';

  data.buildTime = import.meta.env.VITE_APP_TIME;
});

onMounted(() => {
  getUserCount().then((res) => {
    data.userCount = res.data.count;
    data.loading = false;
  });
});
</script>

<style lang="scss" scoped>
.wrap {
  margin: 0 -5px;
  position: relative;
  overflow: hidden;

  &:not(:last-child) {
    margin-bottom: 10px;
  }

  div:not(.el-card) {
    float: left;
    padding: 0 5px 5px;
    width: 50%;
  }
}

.card {
  display: flex;
  align-items: center;
  padding: 30px 20px !important;

  .card-avatar {
    margin-right: 20px;
  }

  .card-content {
    display: block;

    h3 {
      font-size: 20px;
      margin: 5px 0;
    }

    p {
      min-height: 20px;
      margin: 5px 0;
      font-size: 14px;
      color: var(--color-text-3);
    }
  }
}

.el-card {
  border: 0;

  :deep(.el-card__header) {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.arco-spin {
  display: block;
}

.version-information-table {
  width: 100%;
  //overflow: scroll;

  table {
    width: 100%;
    color: var(--color-text-2);
    border-collapse: collapse;
    background-color: var(--color-bg-4);

    td {
      position: relative;
      padding: 9px 15px;
      font-size: 14px;
      line-height: 20px;
      border: 1px solid var(--color-border-2);

      &:nth-child(odd) {
        width: 20%;
        text-align: right;
        background-color: var(--color-fill-2);
      }
    }
  }
}
</style>
