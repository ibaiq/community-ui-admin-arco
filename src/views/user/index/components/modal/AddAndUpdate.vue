<template>
  <!--PC端-->
  <a-modal
    v-if="store.getters.device !== 'mobile'"
    v-model:visible="window.open"
    :title="window.title"
    :width="650"
    modal-class="popups"
    title-align="start"
  >
    <a-form
      :model="window.row"
      :rules="window.rules"
      auto-label-width
      ref="userRef"
    >
      <a-row>
        <a-col :span="12">
          <a-form-item label="用户名" field="username" validate-trigger="blur">
            <a-input v-model="window.row.username" placeholder="请输入用户名" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="昵称" field="nickname" validate-trigger="blur">
            <a-input
              v-model="window.row.nickname"
              placeholder="请输入用户昵称"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="密码" field="password" validate-trigger="blur">
            <a-input
              v-model="window.row.password"
              placeholder="请输入用户密码"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="性别" field="sex" validate-trigger="blur">
            <a-select v-model="window.row.sex" :options="data.sex" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="状态" field="status" validate-trigger="blur">
            <a-radio-group v-model="window.row.status">
              <a-radio :value="true">正常</a-radio>
              <a-radio :value="false">禁用</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <template #footer>
      <div class="dialog-footer">
        <a-space>
          <a-button type="primary" @click="submitForm">确 定</a-button>
          <a-button @click="window.open = false">取 消</a-button>
        </a-space>
      </div>
    </template>
  </a-modal>

  <!--移动端-->
  <a-modal
    v-else
    v-model:visible="window.open"
    :title="window.title"
    width="100%"
    modal-class="dialog-mobile"
    title-align="start"
    @ok="submitForm"
    @cancel="window.open = false"
  >
    <a-form
      :model="window.row"
      :rules="window.rules"
      auto-label-width
      ref="userRef"
    >
      <a-row>
        <a-col :span="24">
          <a-form-item label="用户名" field="username" validate-trigger="blur">
            <a-input v-model="window.row.username" placeholder="请输入用户名" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="昵称" field="nickname" validate-trigger="blur">
            <a-input
              v-model="window.row.nickname"
              placeholder="请输入用户昵称"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="密码" field="password" validate-trigger="blur">
            <a-input
              v-model="window.row.password"
              placeholder="请输入用户密码"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="性别" field="sex" validate-trigger="blur">
            <a-select v-model="window.row.sex" :options="data.sex" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="状态" field="status" validate-trigger="blur">
            <a-radio-group v-model="window.row.status">
              <a-radio :value="true">正常</a-radio>
              <a-radio :value="false">禁用</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <template #footer>
      <div class="dialog-footer">
        <a-button type="primary" @click="submitForm">确 定</a-button>
        <a-button @click="window.open = false">取 消</a-button>
      </div>
    </template>
  </a-modal>
</template>

<script setup>
import { useStore } from 'vuex';
import { getCurrentInstance, reactive } from 'vue';
import { addUser, modify } from '@/api/user.js';

const store = useStore();
const { proxy } = getCurrentInstance();

const props = defineProps({
  window: {
    type: Object,
    required: true,
  },
});
const emits = defineEmits(['refresh']);

const data = reactive({
  sex: [
    {
      label: '未知',
      value: '0',
    },
    {
      label: '男',
      value: '1',
    },
    {
      label: '女',
      value: '2',
    },
  ],
});

const submitForm = () => {
  proxy.$refs.userRef.validate((valid) => {
    if (!valid) {
      if (props.window.row.id === undefined) {
        addUser(props.window.row).then(() => {
          props.window.open = false;
          emits('refresh');
          proxy.$message.success('添加成功');
        });
      } else {
        modify(props.window.row).then(() => {
          props.window.open = false;
          emits('refresh');
          proxy.$message.success('修改成功');
        });
      }
    }
  });
};
</script>

<style scoped></style>
