<template>
  <div :id="myid" class="spider-timer"></div>
</template>

<script>
import {
  reactive,
  onMounted,
  onUnmounted,
  onBeforeMount,
  watch,
  computed,
  ref,
  nextTick,
} from "vue";
import { inject } from "vue";
import { useStore } from "vuex";

export default {
  name: "SpiderTimer",
  props: ["myid"],
  setup(props) {
    let $echarts = inject("echarts");
    let $axios = inject("axios");
    let mydata = reactive([]);
    const store = useStore();
    let collapse = ref(computed(() => store.state.collapse));
    var datas = reactive([]);

    onMounted(() => {
      //防止渲染时未挂载，虽然不知道为什么会出这个bug

        getChartData().then(() => {
         initChart()
        });

    });

    onUnmounted(() => {
      $echarts.dispose;
      //   clearInterval(timeId);
    });
    let chart = reactive(null);
    let tasks = reactive(props.tasks);
    async function getChartData(){
      await $axios
        .post("http://localhost:5000/vpw/getCrawledCount", {
          interval: "day",
          dateStart: "2022-1-22",
          dateEnd: "2022-01-28",
        })
        .then((response) => {
          for (var i = 0; i < response.data.data.length; i++) {
            datas.push(response.data.data[i].count);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      for (var i = 0; i < datas.length; i++) {
        if (i == 0) {
          mydata.push(datas[0]);
        } else {
          mydata.push(datas[i] + mydata[i - 1]);
        }
      }
    };
    function initChart() {
      chart = $echarts.init(document.getElementById(props.myid));
      var option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        toolbox: {
          feature: {
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        legend: {
          data: ["当周运行数量", "运行总数"],
        },
        xAxis: [
          {
            type: "category",
            data: [
              "week1",
              "week2",
              "week3",
              "week4",
              "week5",
              "week6",
              "week7",
            ],
            axisPointer: {
              type: "shadow",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "运行数量",
            // interval: 4,
            axisLabel: {
              formatter: "{value} 个",
            },
          },
          {
            type: "value",
            name: "",
            // interval: 4,
            axisLabel: {
              formatter: "",
            },
          },
        ],
        series: [
          {
            name: "当周运行数量",
            type: "bar",
            tooltip: {
              valueFormatter: function (value) {
                return value + "";
              },
            },
            data: datas,
          },

          {
            name: "运行总数",
            type: "line",
            // yAxisIndex: 1,
            tooltip: {
              valueFormatter: function (value) {
                return value + "";
              },
            },
            data: mydata,
          },
        ],
      };

      chart.setOption(option);
      window.onresize = function () {
        //自适应大小
        chart.resize();
      };
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
      return { initChart, chart, tasks, mydata, getChartData, datas};
    }
  },
};
</script>

<style>
.spider-timer {
  /* height: 260px; */
  /* border-radius: 5px; */
  /* background-color: #020f2e; */
  /* margin: 20px; */
  /* width: 100%; */
  /* border: 1px solid; */
  /* border-color: white; */
  height: 260px;
  border-radius: 5px;
  /* background-color: #0d265e; */
  min-width: 100%;
  border: 1px solid;
  border-color: white;
}
</style>
