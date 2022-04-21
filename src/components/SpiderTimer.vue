<template>
  <div id="spider-timer" class="timer-holder"></div>
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
export default {
  name: "SpiderTimer",
  props: ["datas", "test"],
  setup(props) {
    let $echarts = inject("echarts");
    let $axios = inject("axios");
    let mydata = reactive([]);
    console.log(props.datas.length)
    for (var i = 0; i < props.datas.length; i++) {
      if (i == 0) {
        mydata.push(props.datas[0]);
      } else {
        mydata.push(props.datas[i]+props.datas[i-1]);
      }
    }
    console.log(mydata)
    onMounted(() => {
      //防止渲染时未挂载，虽然不知道为什么会出这个bug
      nextTick(() => {
        //   initChart();
        //   update();F
        //   startInterval();
        initChart();
      });
      //   update();
      //   startInterval();
    });

    onUnmounted(() => {
      $echarts.dispose;
      //   clearInterval(timeId);
    });
    let chart = reactive(null);
    let tasks = reactive(props.tasks);

    function initChart() {
      chart = $echarts.init(document.getElementById("spider-timer"));
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
            min: 0,
            max: 20,
            interval: 4,
            axisLabel: {
              formatter: "{value} 个",
            },
          },
          {
            type: "value",
            name: "",
            min: 0,
            max: 20,
            interval: 4,
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
                return value + " ml";
              },
            },
            data: props.datas,
          },

          {
            name: "运行总数",
            type: "line",
            yAxisIndex: 1,
            tooltip: {
              valueFormatter: function (value) {
                return value + " °C";
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
      return { initChart, chart, tasks, mydata };
    }
  },
};
</script>

<style>
.timer-holder {
  height: 500px;
  border-radius: 5px;
  /* background-color: #020f2e; */
  margin: 6px;
  width: 100%;
  border: 1px solid;
  border-color: white;
}
</style>