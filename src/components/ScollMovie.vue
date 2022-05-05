<template>
  <a-card class="card" style="width: 100%">
    <a-row>
      <a-col :span="20" offset="1">
        <b>网站标题</b>
        <a-divider />
        <div class="marquee-wrap">
          <ul class="marquee-list" :class="{ 'animate-up': animateUp }">
            <li v-for="(item, index) in listData" :key="index">
              {{ item.name }}
            </li>
          </ul>
        </div>
      </a-col>
      <!-- <a-col :span="10" offset="1">
        <b>网站链接</b>
        <a-divider />
        <div class="marquee-wrap">
          <ul class="marquee-list" :class="{ 'animate-up': animateUp }">
            <li v-for="(item, index) in listData" :key="index">
                {{ item.link }}
            </li>
          </ul>
        </div>
      </a-col> -->
    </a-row>
  </a-card>
</template>

<script>
import { onMounted, reactive, inject } from "vue";
import axios from "axios";
export default {
  name: "ScollMovie",
  props: {
    datas: {
      type: Object,
    },
  },
  data() {
    return {
      animateUp: false,
      listData: [],
      timer: null,
    };
  },
  updated() {
    // console.log("1");
    this.listData = [];
    var result = this.getData();
    // console.log("result:", result);
    // this.timer = setInterval(this.scrollAnimate, 1500);
    console.log(this.listData.length)
  },

  mounted() {
    // var result = this.getData();
    // // console.log("result:", result);
    this.timer = setInterval(this.scrollAnimate, 1500);
  },
  methods: {
    getData() {
      var temp = this.listData;
      var data = this.datas[0];
      console.log(data);
      axios
        .post("http://localhost:5000/movie/getMovieInPage", {
          start: 0,
          count: 100,
          site: data,
        })
        .then(function (response) {
          //   console.log(response.data.data);
          //   console.log(temp);
          for (var i = 0; i < response.data.data.length; i++) {
            temp.push(response.data.data[i]);
          }
          //   console.log("data:", temp);
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
.card {
  background-color: rgb(0, 0, 0, 0);
}
a-row {
  max-height: 300px;
}
a-col {
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