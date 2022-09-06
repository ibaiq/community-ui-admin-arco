<template>
  <a-popover position="bottom" trigger="click" content-class="sss">
    <a-input placeholder="请选择图标" readonly v-model="icon">
      <template v-if="icon" #prefix>
        <Component :is="icon" />
      </template>
    </a-input>
    <template #content>
      <div class="content">
        <a-grid :col-gap="10" :cols="8" :row-gap="10">
          <a-grid-item v-for="item in icons">
            <a-button @click="handleSelectIcon(item)">
              <template #icon>
                <component :is="item" style="width: 18px; height: 18px" />
              </template>
            </a-button>
          </a-grid-item>
        </a-grid>
      </div>
    </template>
  </a-popover>
</template>

<script setup name="select-icon">
import { ref } from 'vue';

defineProps({
  icons: {
    required: true,
    type: Array,
  },
});

const icon = ref(null);

const handleSelectIcon = (icon) => {
  console.log(typeof icon);
  icon.value = icon;
};
</script>

<style scoped></style>
