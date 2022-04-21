<template>
  <!-- 登录系统 -->
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">版权监察系统</div>
      <el-form
        :model="param"
        :rules="rules"
        ref="login"
        label-width="0px"
        class="ms-content"
      >
        <el-form-item prop="username">
          <el-input v-model="param.email" placeholder="username">
            <template #prepend>
              <el-button icon="el-icon-user"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="password"
            v-model="param.password"
            @keyup.enter="mySubmit()"
          >
            <template #prepend>
              <el-button icon="el-icon-lock"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="mySubmit()">登录</el-button>
        </div>
        <p class="login-tips">Tips : 账户密码详情咨询管理员。</p>
      </el-form>
    </div>
  </div>
</template>

<script>
import { ref, reactive, inject } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

export default {
  setup() {
    let $axios = inject("axios");
    const router = useRouter();
    const param = reactive({
      email: "",
      password: "",
    });

    const rules = {
      username: [
        {
          required: false,
          trigger: "blur",
        },
      ],
      password: [{ required: true, message: "请输入密码", trigger: "blur" }],
    };
    const login = ref(null);
    function mySubmit() {
      $axios
        .post(
          "http://localhost:5000/user/login",
          {
            ...param,
          },
          {
            headers: {
              "Content-Type": "application/json;charset=utf-8",
            },
            withCredentials: true,
          }
        )
        .then(function (response) {
          if (response.data.status == 200) {
            console.log(response)
            ElMessage.success(response.data.msg);
            localStorage.setItem("ms_username", param.email);
            router.push("/");
          } else if (response.data.status == 203) {
            ElMessage.warning(response.data.msg);
            router.push("/login");
          } else if (response.data.status == 202) {
            ElMessage.error(response.data.msg);
            router.push("/login");
          }
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    const store = useStore();
    store.commit("clearTags");

    return {
      param,
      rules,
      login,
      mySubmit,
    };
  },
};
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../assets/img/3.gif);
  background-size: 100%;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>
