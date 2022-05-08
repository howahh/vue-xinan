<template>
  <a-row>
    <a-col :span="22" :offset="1" style="margin-top: 30px">
      <a-card
        style="
          background-color: white;
          width: 100%;
          min-height: 400px;
          border-radius: 20px;
        "
        :hoverable="true"
      >
        <QAWelcome />
        <!-- <Conversation :ques="ques" :ans="ans" />
        <Conversation :ques="ques" :ans="ans" />
        <Conversation :ques="ques" :ans="ans" /> -->
        <transition-group name="list" tag="p">
          <div v-for="data in conv" :key="data">
            <Conversation :ques="data.que" :ans="data.ans" />
          </div>
        </transition-group>
        <div style="margin-top: 100px; margin-left: 100px; margin-right: 100px">
          <a-input-search
            v-model:value="value"
            placeholder="请输入您的问题"
            enter-button="发送"
            show-count
            :maxlength="20"
            @search="onSearch"
          />
        </div>
      </a-card>
    </a-col>
  </a-row>
</template>

<script>
import Conversation from "../components/Conversation.vue";
import QAWelcome from "../components/QAWelcome.vue";
import { ref, inject, reactive } from "vue";
export default {
  components: { Conversation, QAWelcome },
  setup() {
    // let ques = reactive([]);
    // let ans = reactive([]);
    const value = ref("");
    let conv = reactive([]);
    let $axios = inject("axios");

    const onSearch = (searchValue) => {
      value.value = "";
      console.log("use value", searchValue);

      getConversation(searchValue);
    };

    function getConversation(que) {
      $axios
        .post("http://localhost:5000/apiRequestSender/query/QASystem", {
          param: que,
        })
        .then(function (response) {
          var temp = response.data.data.str;
          if(temp.length>400){
              temp = temp.slice(0, 400);
              temp += "...<br/>您还可以访问我们的知识图谱页面查看更多信息。"
          }
          conv.push({
            que: que,
            ans: temp,
          });
          // console.log(response.data.data.str);
        });
    }

    return { onSearch, conv, value };
  },
};
</script>

<style>
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active,
.list-leave-active {
  transition: all 1s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>