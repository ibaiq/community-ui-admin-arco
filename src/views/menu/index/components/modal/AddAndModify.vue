<template>
  <a-modal
    title-align="start"
    :title="modal.title"
    v-model:visible="modal.open"
    :width="700"
  >
    <a-form
      :model="modal.menu"
      auto-label-width
      ref="formRef"
      :rules="modal.rules"
    >
      <a-row>
        <a-col>
          <a-form-item
            label="上级目录"
            field="parentId"
            validate-trigger="blur"
          >
            <a-tree-select
              :data="modal.treeList"
              :model-value="{ value: modal.active }"
              :field-names="{
                key: 'id',
                title: 'title',
                icon: false,
              }"
              allow-clear
              label-in-value
              placeholder="请选择菜单目录"
              @change="handleChangeSelect"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="菜单属性" field="type" validate-trigger="blur">
            <a-radio-group v-model:model-value="modal.menu.type">
              <a-radio :value="0">目录</a-radio>
              <a-radio :value="1">菜单</a-radio>
              <a-radio :value="2">按钮</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="菜单类型" validate-trigger="blur">
            <a-radio-group v-model:model-value="modal.menu.system">
              <a-radio :value="true">系统菜单</a-radio>
              <a-radio :value="false">普通菜单</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col>
          <a-form-item label="图标" field="icon" validate-trigger="blur">
            <a-popover
              position="bottom"
              trigger="click"
              content-class="custom-select-icon"
            >
              <a-input
                placeholder="请选择图标"
                readonly
                v-model="modal.menu.icon"
              >
                <template v-if="modal.menu.icon" #prefix>
                  <icon-font
                    v-if="modal.menu.icon.includes('#')"
                    :type="modal.menu.icon.replace('#', '')"
                  />
                  <component v-else :is="modal.menu.icon" />
                </template>
              </a-input>
              <template #content>
                <div class="content">
                  <a-grid :col-gap="10" :cols="8" :row-gap="10">
                    <a-grid-item v-for="item in modal.icon">
                      <a-button @click="handleSelectIcon(item)">
                        <template #icon>
                          <icon-font
                            v-if="item.includes('#')"
                            :type="item.replace('#', '')"
                            style="width: 18px; height: 18px"
                          />
                          <component
                            v-else
                            :is="item"
                            style="width: 18px; height: 18px"
                          />
                        </template>
                      </a-button>
                    </a-grid-item>
                  </a-grid>
                </div>
              </template>
            </a-popover>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="菜单名称" field="title" validate-trigger="blur">
            <a-input
              v-model:model-value="modal.menu.title"
              placeholder="请输入菜单名称"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="显示排序" field="sortNum" validate-trigger="blur">
            <a-input-number v-model:model-value="modal.menu.sortNum" :min="0" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="isFrame" validate-trigger="blur">
            <template #label>
              <a-tooltip
                content="选择是外链则路由地址需要以`http(s)://`开头"
                position="top"
              >
                <icon-question-circle-fill />
              </a-tooltip>
              是否外链
            </template>
            <a-radio-group v-model:model-value="modal.menu.isFrame">
              <a-radio :value="true">是</a-radio>
              <a-radio :value="false">否</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="path" validate-trigger="blur">
            <template #label>
              <a-tooltip
                content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头"
                position="top"
              >
                <icon-question-circle-fill />
              </a-tooltip>
              路由地址
            </template>
            <a-input
              v-model:model-value="modal.menu.path"
              placeholder="请输入路由地址"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="visible" validate-trigger="blur">
            <template #label>
              <a-tooltip
                content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问"
                position="top"
              >
                <icon-question-circle-fill />
              </a-tooltip>
              显示状态
            </template>
            <a-radio-group v-model:model-value="modal.menu.visible">
              <a-radio :value="true">显示</a-radio>
              <a-radio :value="false">隐藏</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="status" validate-trigger="blur">
            <template #label>
              <a-tooltip
                content="选择停用则路由将不会出现在侧边栏，也不能被访问"
                position="top"
              >
                <icon-question-circle-fill />
              </a-tooltip>
              菜单状态
            </template>
            <a-radio-group v-model:model-value="modal.menu.status">
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
          <a-button @click="modal.open = false">取 消</a-button>
        </a-space>
      </div>
    </template>
  </a-modal>
</template>

<script setup name="AddAndModify">
import { getCurrentInstance } from 'vue';
import { addMenu, modifyMenu } from '@/api/menu.js';

const { proxy } = getCurrentInstance();

const props = defineProps({
  modal: {
    required: true,
    type: Object,
  },
});
const emits = defineEmits(['refresh']);

const handleChangeSelect = (value) => {
  props.modal.active = value.value;
  props.modal.menu.parentId = value.value;
};

const handleSelectIcon = (icon) => {
  props.modal.menu.icon = icon;
};

const submitForm = () => {
  proxy.$refs.formRef.validate((valid) => {
    if (!valid) {
      if (props.modal.menu.id) {
        modifyMenu(props.modal.menu).then(() => {
          emits('refresh');
          props.modal.open = false;
          proxy.$message.success('修改成功');
        });
      } else {
        addMenu(props.modal.menu).then(() => {
          emits('refresh');
          props.modal.open = false;
          proxy.$message.success('添加成功');
        });
      }
    }
  });
};
</script>

<style lang="scss" scoped></style>
