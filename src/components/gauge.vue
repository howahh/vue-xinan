<template>
  <div id="theGauge" class="gauge-holder"></div>
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
  name: "Gauge",
  props: ['tasks'],
  setup(props) {
    let $echarts = inject("echarts");
    let $axios = inject("axios");

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
    let chart = reactive(null)
    let tasks = reactive(props.tasks)
    function initChart() {
      chart = $echarts.init(document.getElementById("theGauge"));
      var option = {
        tooltip: {
          formatter: "{a} <br/>{b} : {c}%",
        },
        series: [
          {
            name: "Pressure",
            type: "gauge",
            max: "20",
            detail: {
              formatter: "{value}",
            },
            data: [
              {
                value: tasks,
                name: "当前运行的任务数量",
              },
            ],
          },
        ],
      };
      chart.setOption(option);
      window.onresize = function () {
        //自适应大小
        chart.resize();
      };
    }

    return { initChart,chart, tasks };
  },
};
</script>

<style scoped>
.gauge-holder {
  height: 500px;
  border-radius: 5px;
  /* background-color: #020f2e; */
  margin: 6px;
  width: 100%;
  border: 1px solid;
  border-color:white;

}
</style>