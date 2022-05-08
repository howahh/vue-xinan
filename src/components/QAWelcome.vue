<template>
  <a-row>
    <a-col :span="10" :offset="1">
      <div style="margin-top: 30px">
        <a-avatar
          style="width: 70px; height: 70px; float: left"
          :src="ans"
        />
        <div
          style="
            margin-left: 20px;
            margin-top:15px;
            width: 400px;
            min-height: 20px;
            float: left;
            border-radius: 20px;
            background-color: rgb(119, 136, 153, 0.5);
            word-wrap: break-word;
          "
        >
          <div style="margin-left: 10px; margin-top: 10px; margin-right: 10px; margin-bottom:10px;">
            欢迎来到知识产权侵权溯源系统，我是您的智能助理。
          </div>
        </div>
      </div>
    </a-col>
    <a-col :span="10" :offset="1"></a-col>
  </a-row>
</template>

<script>
import ansURL from "../assets/img/ans.png";
export default {
  name: "QAWelcome",
  setup() {
      let ans = ansURL;
      return {ans};
  },
};
</script>

<style>
</style>