<template>
  <div class="site" arco-theme="light">
    <div class="container">
      <div class="login">
        <div v-if="store.getters.device === 'desktop'" class="hero">
          <h1
            >欢 迎<br />
            登录Lazy管理系统</h1
          >
          <p>如果你没有账户,<br />可以在这里<a href="javascript:">注册</a>.</p>
        </div>
        <div class="main">
          <h1
            v-if="store.getters.device === 'mobile'"
            style="text-align: center; margin-bottom: 30px"
            >登 录</h1
          >
          <a-form :model="data.formDate.user" :rules="rules" ref="form">
            <a-form-item field="username" validate-trigger="blur" hide-label>
              <a-input
                placeholder="请输入用户名"
                v-model:model-value="data.formDate.user.username"
              />
            </a-form-item>
            <a-form-item
              field="password"
              validate-trigger="blur"
              :content-flex="false"
              hide-label
            >
              <a-input-password
                placeholder="请输入密码"
                v-model:model-value="data.formDate.user.password"
              />
              <div class="reset"><a href="javascript:">找回密码</a></div>
            </a-form-item>
            <!--<a-form-item hide-label>-->
            <!--  <a-checkbox>记住密码</a-checkbox>-->
            <!--</a-form-item>-->
            <a-form-item hide-label>
              <a-button type="primary" :loading="data.loading" @click="submit">
                <span v-if="!data.loading">登 录</span>
                <span v-else>登 录 中...</span>
              </a-button>
            </a-form-item>
          </a-form>
          <div class="options">
            <div class="separator">
              <p>or continue with</p>
            </div>
            <a-row>
              <a-col :span="8">
                <a-button @click="handleWeibo">
                  <template #icon>
                    <icon-weibo />
                  </template>
                </a-button>
              </a-col>
              <a-col :span="8">
                <a-button @click="handleWechat">
                  <template #icon>
                    <icon-wechat />
                  </template>
                </a-button>
              </a-col>
              <a-col :span="8">
                <a-button @click="handleGithub">
                  <template #icon>
                    <icon-github />
                  </template>
                </a-button>
              </a-col>
            </a-row>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="Login">
import { getCurrentInstance, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { login } from '@/api/user.js';
import { setToken } from '@/utils/auth.js';
import { Message } from '@arco-design/web-vue';
import Cookies from 'js-cookie';
import { Base64 } from 'js-base64';

const { proxy } = getCurrentInstance();
const store = useStore();
const router = useRouter();
const route = useRoute();

const data = reactive({
  formDate: {
    user: {
      username: '',
      password: '',
    },
    rememberMe: false,
  },
  loading: false,
});

if (import.meta.env.DEV) {
  data.formDate.user = {
    username: 'admin',
    password: 'admin',
  };
}

const rules = reactive({
  username: [
    { required: true, message: '请输入用户名！' },
    { minLength: 4, maxLength: 18, message: '长度在 4 到 18 个字符' },
  ],
  password: [
    { required: true, message: '请输入密码！', trigger: 'blur' },
    { minLength: 5, maxLength: 18, message: '长度在 5 到 18 个字符' },
  ],
});

const redirect = ref(undefined);

watch(
  () => route.query,
  (value) => {
    redirect.value = value.redirect;
  },
  {
    deep: true,
    immediate: true,
  }
);

const submit = () => {
  proxy.$refs.form.validate((valid) => {
    if (!valid) {
      data.loading = true;
      if (data.formDate.rememberMe) {
        Cookies.set(
          'rememberMe',
          Base64.encode(JSON.stringify(data.formDate)),
          { expires: 7 }
        );
      } else {
        Cookies.remove('rememberMe');
      }
      login(data.formDate.user)
        .then((res) => {
          Message.success(res.msg);
          setToken(res.data.token);
          store.commit('user/SET_TOKEN', res.data.token);
          router.replace(redirect.value ? redirect.value : '/');
        })
        .catch(() => {
          data.loading = false;
        });
    } else {
      return false;
    }
  });
};

const getCookie = () => {
  let rememberMe = Cookies.get('rememberMe');
  if (rememberMe !== undefined) {
    try {
      data.formDate = JSON.parse(Base64.decode(rememberMe));
    } catch (e) {
      data.formDate = {
        user: {
          username: '',
          password: '',
        },
        rememberMe: false,
      };
    }
  }
};

getCookie();

document.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    submit();
  }
});

const handleWeibo = () => {
  handleNotAvailable();
};
const handleWechat = () => {
  handleNotAvailable();
};
const handleGithub = () => {
  handleNotAvailable();
};

const handleNotAvailable = () => {
  proxy.$message.warning({
    id: 'message',
    content: '暂未开放',
  });
};

</script>

<style scoped lang="scss">
@import './style';
</style>
