<template>
  <div class="map-holder" id="map"></div>
</template>

<script>
import {
  reactive,
  onMounted,
  onUnmounted,
  onBeforeMount,
  computed,
  watch,
  nextTick,
  ref,
} from "vue";
import { inject } from "vue";
import { useStore } from "vuex";

export default {
  name: "Map",
  setup() {
    /// 声明接收一下echart,axios
    const store = useStore();
    let collapse = ref(computed(() => store.state.collapse));
    let $echarts = inject("echarts");
    let $axios = inject("axios");
    //reactive化
    let datas = reactive([]);
    let chart = reactive(null);
    //定时器id
    let timeId = null;

    onMounted(() => {
      nextTick(() => {
        initChart();
        startInterval();
      });
    });

    onUnmounted(() => {
      $echarts.dispose;
      clearInterval(timeId);
    });
    //初始化表格
    function initChart() {
      chart = $echarts.init(document.getElementById("map"), "dark");
      getdata().then(() => {
        console.log("onMounted", datas);
        chart.setOption({
          //标题配置
          title: {
            text: "▎网页新增数量",
            left: 10,
            top: 10,
          },
          //展示图的展示位置
          grid: {
            top: "20%",
            left: "3%",
            right: "6%",
            bottom: "3%",
            containLabel: true, // 距离是包含坐标轴上的文字
          },
          legend: {
            show: true,
          },
          xAxis: {
            type: "category",
            data: ["七月", "八月", "九月", "十月", "十一月", "十二月"],
          },
          yAxis: {
            type: "value",
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "line",
              z: 0,
              lineStyle: {
                color: "#2D3443",
              },
            },
          },
          series: [
            {
              type: "bar",
              label: {
                show: true,
                position: "top",
                textStyle: {
                  color: "white",
                },
              },
              itemStyle: {
                // 指明颜色渐变的方向
                // 指明不同百分比之下颜色的值
                color: new $echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  // 百分之0状态之下的颜色值
                  {
                    offset: 0,
                    color: "#5052EE",
                  },
                  // 百分之100状态之下的颜色值
                  {
                    offset: 1,
                    color: "#AB6EE5",
                  },
                ]),
              },
            },
          ],
        });
        window.onresize = function () {
          //自适应大小
          chart.resize();
        };
      });
    }
    //获取并更新图表数据
    function update() {
      getdata();
      let dataOption = {
        series: [
          {
            data: datas,
          },
        ],
      };
      chart.setOption(dataOption);
    }
    //axios获取数据
    async function getdata() {
      await $axios
        .get("/api/testdata")
        .then(function (response) {
          datas = response.data.data.list.map((item) => {
            return item.age;
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    //定时获取数据
    function startInterval() {
      if (timeId) {
        clearInterval(timeId);
      }
      timeId = setInterval(() => {
        update();
      }, 500);
    }
    //折叠栏更改时resize，注意time的设置
    watch(
      collapse,
      (newValue, oldValue) => {
        console.log("折叠变化了", newValue, oldValue);
        setTimeout(() => {
          chart.resize();
        }, 300);
      },
      { immediate: true }
    );

    return { getdata, datas, update, chart, initChart, startInterval };
  },
};
</script>

<style scoped lang="css">
.map-holder {
  height: 453px;
  border-radius: 5px;
  background-color: #0d265e;
  margin: 6px;
  width: 100%;
}
</style>