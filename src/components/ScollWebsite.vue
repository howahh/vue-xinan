<template>
  <div>
    <a-card :bordered="false" style="width: 700px">
      <a-row :gutter="30">
        <a-col :span="12">网站标题</a-col>
        <a-col :span="12">网站链接</a-col>
      </a-row>
      <a-row>
        <a-col> </a-col>
      </a-row>
      <a-row>
        <a-col></a-col>
      </a-row>
      <div class="marquee-wrap">
        <!-- <a-row
          :gutter="30"
          v-for="(item, index) in data"
          :key="index"
          :class="{ 'animate-up': animateUp }"
        >
          <a-col class="col" :span="12">{{ item.title }}</a-col>
          <a-col class="col" :span="12">{{ item.url }}</a-col>
        </a-row> -->
        <ul class="marquee-list" :class="{ 'animate-up': animateUp }">
          <li v-for="(item, index) in data" :key="index">{{ item.title }}</li>
        </ul>
      </div>
    </a-card>
  </div>
</template>
<script>
import { defineComponent, reactive, inject, onBeforeMount, onMounted } from "vue";

export default {
  setup() {
    onBeforeMount(() => {
      getData();
    });

    onMounted(()=>{
      myTimer();
    })

    let $axios = inject("axios");
    var animateUp = reactive(false);
    var data = reactive([]);
    async function getData() {
      $axios
        .post("http://localhost:5000/vpw/getVpwTitleAndUrl", {
          count: 12,
        })
        .then(function (response) {
          console.log(response.data.data);
          for (var i = 0; i < response.data.data.length; i++) {
            data.push(response.data.data[i]);
          }
          console.log("data:", data);
        });
    }

    function myTimer() {
      setInterval(() => {
        scrollAnimate();
      }, 1500);
    }

    function scrollAnimate() {
      animateUp = true;
      setTimeout(() => {
        data.push(data[0]);
        data.shift();
        console.log(data);
        console.log(animateUp);
        animateUp = false;
      }, 500);
    }

    return {
      data,
      scrollAnimate,
      animateUp,
      myTimer,
    };
  },
};
</script>

<style lang="scss" scoped>
.marquee-wrap {
  height: 60px;
  overflow: hidden;
  .marquee-list {
    li {
      line-height: 20px;
      text-align: center;
    }
  }
  .animate-up {
    transition: all 0.5s ease-in-out;
    transform: translateY(-20px);
  }
}
</style>