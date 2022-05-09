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
  <a-row>
  <transition-group tag="">
    <a-col v-for="item in done" :key="item" class="cols" :span="6" offset="1">
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
        .post("http://localhost:5000/apiRequestSender/query/getTimerRemain",{a:1})
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

.v-item {
	list-style-type: none;
	/**
	 * 可以在v-enter-active和v-move中分别用transition过渡，也可以在item中用transition，包含了这两项
	 * 要用all不用transform，有可能是因为splice删除效果不是transform
	 */
	transition: all 1s;
}
.v-enter-active,.v-leave-active {
	transition: all 1s;
}
.v-move {
	transition: all 1s;
}
.v-enter,.v-leave-to {
	opacity:0;
	transform: translateY(20px);
}
.v-leave-active {
	position:absolute;
}

</style>