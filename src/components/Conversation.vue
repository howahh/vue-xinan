<template>
  <a-row>
    <a-col :span="10" :offset="1"></a-col>
    <a-col :span="10" :offset="1">
      <div style="margin-top: 50px; float: right;">
        <div
          style="
            margin-right: 20px;
            margin-top:15px;
            min-height: 40px;
            min-width:20px;
            float: left;
            border-radius: 20px;
            background-color: rgb(135, 206, 250, 1);
            word-wrap: break-word;
          "
        >
          <!-- min-height -->
          <div style="margin-left: 10px; margin-top: 10px; margin-right: 10px; margin-bottom:10px;">
            <div v-html="question"></div>
          </div>
        </div>
        <a-avatar
          style="width: 70px; height: 70px; float: left"
          :src="que"
        />
      </div>
    </a-col>
  </a-row>
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
            <div v-html="answer"></div>
          </div>
        </div>
      </div>
    </a-col>
    <a-col :span="10" :offset="1"></a-col>
  </a-row>
</template>

<script>
import { ref } from "vue";
import ansURL from "../assets/img/ans.png";
import queURL from "../assets/img/que.png"
export default {
  name: "Conversation",
  props: ["ques", "ans"],
  setup(props) {
    let question = ref(props.ques);
    let answer = ref(props.ans);
    var ans = ansURL;
    var que = queURL
    return { question, answer, ans, que };
  },
};
</script>

<style>
</style>