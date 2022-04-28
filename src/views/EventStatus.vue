<template>
  <a-row>
    <a-col></a-col>
  </a-row>
  <a-row>
    <transition-group>
      <a-col
        v-for="(item, index) in working"
        :key="index"
        class="cols"
        :span="6"
        offset="1"
      >
        <working-card :TaskName="item" />
      </a-col>
    </transition-group>
  </a-row>
  <a-row style="margin-top: 25px">
    <a-col :span="24"><a-divider /></a-col>
  </a-row>
  <a-row class="change">
    <transition-group tag="">
      <a-col
        v-for="item in done"
        :key="item"
        class="cols list-item"
        :span="6"
        offset="1"
      >
        <done-card @func="doneClick" :TaskName="item" />
      </a-col>
    </transition-group>
  </a-row>
</template>

<script>
import WorkingCard from "../components/WorkingCard.vue";
import DoneCard from "../components/DoneCard.vue";
import { inject, onBeforeMount, reactive } from "vue";

export default {
  components: { WorkingCard, DoneCard },
  setup() {
    var $axios = inject("axios");
    var working = reactive([]);
    var done = reactive([]);
    onBeforeMount(() => {
      getData();
    });

    var temp = reactive([]);
    function doneClick(value) {
      console.log(value.name);
      temp = done.concat();
      for (var i = 0; i < temp.length; i++) {
        done.pop();
        console.log(done);
      }
      for (var i = 0; i < temp.length; i++) {
        if (temp[i] != value.name) {
          done.push(temp[i]);
          console.log(done);
        }
      }
    }

    function getData() {
      $axios
        .post("http://localhost:5000/apiRequestSender/query/getTimerRemain")
        .then(function (response) {
          console.log(response.data.data);
          for (var i = 0; i < response.data.data.length; i++) {
            if (response.data.data[i].remain <= 0) {
              done.push(response.data.data[i].name);
            } else {
              working.push(response.data.data[i].name);
            }
          }
          console.log("working:", working);
          console.log("done:", done);
        });
    }

    return { working, done, getData, doneClick };
  },
};
</script>

<style scoped>
.cols {
  margin-top: 40px;
}
.v-enter-active,
.v-leave-active {
  transition: all 0.6s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>