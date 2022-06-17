<template>
  <!--PC端-->
  <a-modal
    v-if="store.getters.device !== 'mobile'"
    v-model:visible="modal.open"
    :title="modal.title"
    :width="400"
    modal-class="popups"
    title-align="start"
    @before-open="beforeOpen"
  >
    <a-form
      :model="modal.role"
      :rules="modal.rules"
      auto-label-width
      ref="roleRef"
    >
      <a-row :gutter="[0, 15]">
        <a-col :span="24">
          <a-form-item label="角色名称" field="title" validate-trigger="blur">
            <a-input v-model="modal.role.title" placeholder="请输入角色名称" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item field="name" validate-trigger="blur">
            <template #label>
              <el-tooltip
                placement="top"
                content="控制器中定义的权限字符，如：@PreAuthorize(`hasAuthority('sys:role:delete')`)"
              >
                <icon-question-circle-fill />
              </el-tooltip>
              权限标识
            </template>
            <a-input
              v-model="modal.role.name"
              placeholder="请输入角色唯一标识"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="类型" field="type" validate-trigger="blur">
            <a-radio-group v-model="modal.role.type" :default-value="false">
              <a-radio :value="true">系统内置</a-radio>
              <a-radio :value="false">普通</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="状态" field="status" validate-trigger="blur">
            <a-radio-group v-model="modal.role.status" :default-value="true">
              <a-radio :value="true">正常</a-radio>
              <a-radio :value="false">禁用</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="备注" field="name" validate-trigger="blur">
            <a-textarea
              auto-size
              v-model="modal.role.description"
              placeholder="请输入角色描述"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <template #footer>
      <div class="dialog-footer">
        <a-space>
          <a-button type="primary" @click="submitForm">确 定</a-button>
          <a-button @click="modal.open = false">取 消</a-button>
        </a-space>
      </div>
    </template>
  </a-modal>

  <!--移动端-->
  <a-modal
    v-else
    v-model:visible="modal.open"
    :title="modal.title"
    width="100%"
    modal-class="dialog-mobile"
    title-align="start"
  >
    <a-form
      :model="modal.role"
      :rules="modal.rules"
      auto-label-width
      ref="roleRef"
    >
      <a-row :gutter="[0, 15]">
        <a-col :span="24">
          <a-form-item label="角色名称" field="title" validate-trigger="blur">
            <a-input v-model="modal.role.title" placeholder="请输入角色名称" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item field="name" validate-trigger="blur">
            <template #label>
              <el-tooltip
                placement="top"
                content="控制器中定义的权限字符，如：@PreAuthorize(`hasAuthority('sys:role:delete')`)"
              >
                <icon-question-circle-fill />
              </el-tooltip>
              权限标识
            </template>
            <a-input
              v-model="modal.role.name"
              placeholder="请输入角色唯一标识"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="类型" field="type" validate-trigger="blur">
            <a-radio-group v-model="modal.role.type" :default-value="false">
              <a-radio :value="true">系统内置</a-radio>
              <a-radio :value="false">普通</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="状态" field="status" validate-trigger="blur">
            <a-radio-group v-model="modal.role.status" :default-value="true">
              <a-radio :value="true">正常</a-radio>
              <a-radio :value="false">禁用</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="备注" field="name" validate-trigger="blur">
            <a-textarea
              auto-size
              v-model="modal.role.description"
              placeholder="请输入角色描述"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <template #footer>
      <div class="dialog-footer">
        <a-space>
          <a-button type="primary" @click="submitForm">确 定</a-button>
          <a-button @click="modal.open = false">取 消</a-button>
        </a-space>
      </div>
    </template>
  </a-modal>
</template>

<script setup>
import { useStore } from 'vuex';
import { getCurrentInstance } from 'vue';
import { addRole, modifyRole } from '@/api/role.js';

const props = defineProps({
  modal: {
    type: Object,
    required: true,
  },
});
const emits = defineEmits(['refresh']);

const { proxy } = getCurrentInstance();
const store = useStore();

const beforeOpen = () => {
  proxy.$refs.roleRef.clearValidate();
};

const submitForm = () => {
  proxy.$refs.roleRef.validate((valid) => {
    if (!valid) {
      if (props.modal.role.id === undefined) {
        addRole(props.modal.role).then(() => {
          props.modal.open = false;
          emits('refresh');
          proxy.$message.success('添加成功');
        });
      } else {
        modifyRole(props.modal.role).then(() => {
          props.modal.open = false;
          emits('refresh');
          proxy.$message.success('修改成功');
        });
      }
    }
  });
};
</script>

<style scoped></style>
