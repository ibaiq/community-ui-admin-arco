<template>
  <div v-if="!item.hidden">
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
        onlyOneChild.meta.type === 1 &&
        !item.alwaysShow
      "
    >
      <app-link :to="resolvePath(onlyOneChild.path, onlyOneChild.query)">
        <a-menu-item :key="resolvePath(onlyOneChild.path, onlyOneChild.query)">
          <template v-if="item.meta.icon" #icon>
            <icon-font
              v-if="item.meta.icon.includes('#')"
              :type="item.meta.icon.replace('#', '')"
            />
            <component v-else :is="item.meta.icon" />
          </template>
          {{ item.meta.title }}
        </a-menu-item>
      </app-link>
    </template>
    <a-sub-menu :key="item.name" v-else>
      <template #icon>
        <icon-font
          v-if="item.meta.icon.includes('#')"
          :type="item.meta.icon.replace('#', '')"
        />
        <component v-else :is="item.meta.icon" />
      </template>
      <template #title>
        {{ item.meta.title }}
      </template>
      <SidebarItem
        v-for="child in item.children"
        :item="child"
        :base-path="resolvePath(child.path, undefined)"
      />
    </a-sub-menu>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { isExternal } from '@/utils/validate.js';
import AppLink from './Link.vue';
import { useStore } from 'vuex';
import { resolve } from 'path-browserify';

const store = useStore();

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  isNest: {
    type: Boolean,
    default: false,
  },
  basePath: {
    type: String,
    default: '',
  },
});

const onlyOneChild = ref({});
const lang = computed(() => store.getters.language);

const hasOneShowingChild = (children = [], parent) => {
  if (!children) {
    children = [];
  }
  const showingChildren = children.filter((item) => {
    if (item.hidden) {
      return false;
    } else {
      // Temp set(will be used if only has one showing child)
      onlyOneChild.value = item;
      return true;
    }
  });

  // When there is only one child router, the child router is displayed by default
  if (showingChildren.length === 1) {
    return true;
  }

  // Show parent if there are no child router to display
  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: '', noShowingChildren: true };
    return true;
  }

  return false;
};

const resolvePath = (routePath, routeQuery) => {
  if (isExternal(routePath)) {
    return routePath;
  }
  if (isExternal(props.basePath)) {
    return props.basePath;
  }
  if (routeQuery) {
    let query = JSON.parse(routeQuery);
    return {
      path: resolve(props.basePath, routePath),
      query: query,
    };
  }
  return resolve(props.basePath, routePath);
};
</script>

<style lang="scss" scoped>
.el-menu-item.is-active {
  border-right: 0.15rem solid #409eff;
  transition: border-right-width 0.15s;
  background: rgba(64, 158, 255, 0.1);

  .arco-icon {
    //color: initial;
  }

  .svg-icon {
    //color: initial;
  }
}

.svg-icon {
  width: 1.2em;
  height: 1.2em;
}

.arco-icon {
  width: 1.2em;
  height: 1.2em;
  vertical-align: text-bottom;
}
</style>
