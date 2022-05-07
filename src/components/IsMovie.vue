<template>
  <div class="line-holder" id="myid"></div>
</template>

<script>
import {
  reactive,
  onMounted,
  onUnmounted,
  watch,
  computed,
  ref,
  nextTick,
} from "vue";
import { inject } from "vue";
import { useStore } from "vuex";
export default {
  name: "IsMovie",
  props: ["num"],
  setup(props) {
    /// 声明接收一下echart,axios
    const store = useStore();
    //获取折叠栏状态
    let collapse = ref(computed(() => store.state.collapse));
    let $echarts = inject("echarts");
    let $axios = inject("axios");
    //reactive化
    let datas = reactive([]);
    let movie = props.num;
    let non_movie = Math.round(Math.random() * (movie * 0.8 - 200)) + 200;
    let chart = reactive(null);
    //定时器id
    let timeId = null;

    onMounted(() => {
      //防止渲染时未挂载，虽然不知道为什么会出这个bug
      nextTick(() => {
        initChart();
        update();
      });
    });

    onUnmounted(() => {
      $echarts.dispose;
      clearInterval(timeId);
    });
    //初始化表格
    function initChart() {
      chart = $echarts.init(document.getElementById("myid"));
      let dataOption = {
        title: {
          text: "本次任务监测的侵权电影状况",
          //   subtext: "Fake Data",
          left: "center",
        },
        // color: ["#FF9933", "#FFFFCC"],
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ({d}%)",
        },
        legend: {
          bottom: 10,
          left: "center",
          data: ["侵权电影网站", "其他网站"],
        },
        series: [
          {
            type: "pie",
            radius: "65%",
            center: ["50%", "50%"],

            selectedMode: "single",
            data: [
              { value: movie, name: "侵权电影网站" },
              { value: non_movie, name: "其他网站" },
            ].sort(function (a, b) {
              return a.value - b.value;
            }),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      chart.setOption(dataOption);
      window.onresize = function () {
        //自适应大小
        chart.resize();
      };
    }
    //获取并更新图表数据
    function update() {
      // console.log(props);
      //   getdata().then(() => {
      //   });
    }
    //axios获取数据
    async function getdata() {
      await $axios
        .post("", {})
        .then((response) => {
          // console.log(response)
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    //折叠栏更改时resize，注意time的设置
    watch(
      collapse,
      (newValue, oldValue) => {
        // console.log("折叠变化了", newValue, oldValue);
        setTimeout(() => {
          chart.resize();
        }, 300);
      },
      { immediate: true }
    );

    return { getdata, datas, update, chart, initChart };
  },
};
</script>

<style scoped lang="css">
.line-holder {
  height: 400px;
  border-radius: 5px;
  /* background-color: #0d265e; */
  margin: 6px;
  width: 100%;
  border: 1px solid;
  border-color: white;
}
</style>
