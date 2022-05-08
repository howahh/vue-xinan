<template>
  <div class="place-holder">
    <div style="height:50px; color:white">
        这里加个标题？
    </div>
    <div class="scoll-container">
      <div class="scoll">
        <div v-for="item in title" :key="item">
          <div style="color: white">{{ item }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onBeforeMount, inject } from "vue";

export default {
  name: "IndexRoll",
  setup() {
    let $axios = inject("axios");
    let title = reactive([]);

    onBeforeMount(() => {
      getData();
    });

    function getData() {
      $axios
        .post("http://localhost:5000/vpw/getVpwInPage", {
          start: 0,
          count: 100,
        })
        .then((response) => {
          for (var i = 0; i < response.data.data.length; i++) {
            var temp = response.data.data[i].title;
            if(temp.length>20){
                temp = temp.slice(0,20) + '...'
            }
            title.push(temp);
          }
        });
    }

    return { title };
  },
};
</script>

<style>
.place-holder {
  height: 224px;
  border-radius: 5px;
  margin: 6px;
  width: 100%;
  border: 1px solid;
  border-color: white;
}
.scoll-container {
  height: 170px;
  overflow: hidden;
}
.scoll {
  margin: 20px;
  animation: myScoll 40s linear infinite;
}
.scoll:hover {
  animation-play-state: paused;
}
@keyframes myScoll {
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(-50%);
  }
}
</style>