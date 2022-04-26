<template>
  <a-card class="card" style="width: 45%">
    <a-row>
      <a-col :span="14" offset="1">
        <b>网站标题</b>
         <a-divider />
        <div class="marquee-wrap">
          <ul class="marquee-list" :class="{ 'animate-up': animateUp }">
            <li v-for="(item, index) in listData" :key="index">
              {{ item.title }}
            </li>
          </ul>
        </div>
      </a-col>
      <a-col :span="6" offset="1">
        <b>网站链接</b>
         <a-divider />
        <div class="marquee-wrap">
          <ul class="marquee-list" :class="{ 'animate-up': animateUp }">
            <li v-for="(item, index) in listData" :key="index">
              {{ item.url }}
            </li>
          </ul>
        </div>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import { onMounted, reactive, inject } from "vue";
import axios from "axios";
export default {
  name: "ScollExample",
  data() {
    return {
      animateUp: false,
      listData: [],
      timer: null,
    };
  },

  mounted() {
    var result = this.getData();
    console.log("result:", result);
    this.timer = setInterval(this.scrollAnimate, 1500);
  },
  methods: {
    getData() {
      var temp = this.listData;
      axios
        .post("http://localhost:5000/vpw/getVpwTitleAndUrl", {
          count: 50,
        })
        .then(function (response) {
          console.log(response.data.data);
          console.log(temp);
          for (var i = 0; i < response.data.data.length; i++) {
            if (response.data.data[i].title.length >= 20) {
              response.data.data[i].title =
                response.data.data[i].title.substr(0, 20) + "...";
            }
            if (response.data.data[i].url.length >= 20) {
              response.data.data[i].url =
                response.data.data[i].url.substr(0, 20) + "...";
            }
            temp.push(response.data.data[i]);
          }
          console.log("data:", temp);
          return temp;
        });
    },

    scrollAnimate() {
      this.animateUp = true;
      setTimeout(() => {
        this.listData.push(this.listData[0]);
        this.listData.shift();
        this.animateUp = false;
      }, 500);
    },
  },
  destroyed() {
    clearInterval(this.timer);
  },
};
</script>

<style lang="scss" scoped>
.card{
  background-color: rgb(0,0,0,0);
}
a-row{
  max-height: 300px;
}
a-col{
  max-height: 300px;
}
.marquee-wrap {
  height: 330px;
  overflow: hidden;
  .marquee-list {
    li {
      line-height: 30px;
    }
  }
  .animate-up {
    transition: all 0.5s ease-in-out;
    transform: translateY(-30px);
  }
}
</style>