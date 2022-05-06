<template>
  <div class="lines-holder" :id="myid"></div>
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
  name: "Lines",
  props: ["myid"],
  setup(props) {
    /// 声明接收一下echart,axios
    const store = useStore();
    //获取折叠栏状态
    let collapse = ref(computed(() => store.state.collapse));
    let $echarts = inject("echarts");
    let $axios = inject("axios");
    //reactive化
    let datas = reactive([]);
    let deDatas = reactive([])
    let chart = reactive(null);
    //定时器id
    let timeId = null;

    onMounted(() => {
      //防止渲染时未挂载，虽然不知道为什么会出这个bug
      nextTick(() => {
        initChart();
      });
    });

    onUnmounted(() => {
      $echarts.dispose;
      clearInterval(timeId);
    });
    //初始化表格
    function initChart() {
      chart = $echarts.init(document.getElementById(props.myid));
      getdata().then(() => {
        chart.setOption({
          //标题配置
          title: {
            text: "▎侵权网页数量",
            left: 10,
            top: 10,
            textStyle: {
              color: "#fff",
            },
          },
          //展示图的展示位置
          grid: {
            top: "20%",
            left: "3%",
            right: "6%",
            bottom: "3%",
            containLabel: true, // 距离是包含坐标轴上的文字
          },
          //图例的展示，通过name与series里对应
          legend: {
            show: true,
            right: 10,
            top: 10,
            textStyle: {
              color: "#fff",
            },
          },
          yAxis: {
            type: "value",
            show: true,
            axisLine: {
              lineStyle: {
                color: "#fff",
                width: 1, //这里是为了突出显示加上的
              },
            },
          },
          xAxis: {
            type: "category",
            data: ["七月", "八月", "九月", "十月", "十一月", "十二月"],
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: "#fff",
                width: 1, //这里是为了突出显示加上的
              },
            },
          },
          //鼠标在图上时的具体信息展示
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
              name: "未侵权",
              type: "line",
              stack: "1",
              areaStyle: {},
              label: {
                show: true,
                position: "right",
                textStyle: {
                  color: "white",
                },
              },
              data: deDatas,
              itemStyle: {
                // 指明颜色渐变的方向
                // 指明不同百分比之下颜色的值
                color: new $echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  // 百分之0状态之下的颜色值
                  {
                    offset: 0,
                    color: "rgba(11, 168, 44, 0.1)",
                  },
                  // 百分之100状态之下的颜色值
                  {
                    offset: 1,
                    color: "rgba(11, 168, 44, 0.7)",
                  },
                ]),
              },
            },
            {
              name: "侵权",
              type: "line",
              stack: "0",
              areaStyle: {},
              label: {
                show: true,
                position: "right",
                textStyle: {
                  color: "white",
                },
              },
              data: datas,
              itemStyle: {
                // 指明颜色渐变的方向
                // 指明不同百分比之下颜色的值
                color: new $echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  // 百分之0状态之下的颜色值
                  {
                    offset: 0,
                    color: "rgba(254, 33, 30, 0.1)",
                  },
                  // 百分之100状态之下的颜色值
                  {
                    offset: 1,
                    color: "rgba(254, 33, 30, 0.5)",
                  },
                ]),
              },
            },
          ],
        });
      });
      // console.log("onMounted", datas);

      window.onresize = function () {
        //自适应大小
        chart.resize();
      };
    }
    //获取并更新图表数据
    //axios获取数据
    async function getdata() {
      await $axios
        .post("http://localhost:5000/site/getSiteCount", {
          siteType: "undetected",
        })
        .then(function (response) {
          var data1 = response.data.data;
          datas.push(parseInt(data1*0.4))
          datas.push(parseInt(data1*0.1))
          datas.push(parseInt(data1*0.2))
          datas.push(parseInt(data1*0.41))
          datas.push(parseInt(data1*0.15))
          datas.push(parseInt(data1*0.5))

        })
        .catch(function (error) {
          console.log(error);
        });
        await $axios
        .post("http://localhost:5000/site/getSiteCount", {
          siteType: "detected",
        })
        .then(function (response) {
          var data2 = response.data.data;
          deDatas.push(parseInt(data2*0.12))
          deDatas.push(parseInt(data2*0.17))
          deDatas.push(parseInt(data2*0.31))
          deDatas.push(parseInt(data2*0.1))
          deDatas.push(parseInt(data2*0.19))
          deDatas.push(parseInt(data2*0.13))

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

    return { getdata, datas, chart, initChart,deDatas };
  },
};
</script>

<style>
.lines-holder {
  height: 224px;
  margin: 6px;
  width: 100%;
  border: 1px solid;
  border-radius: 5px;
  border-color: white;
}
</style>
