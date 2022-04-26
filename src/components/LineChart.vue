<template>
  <div class="line-holder" :id="myid"></div>
  <!-- <p>{{mytype}}</p> -->
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
  name: "LineChart",
  props: ['myid','mytype'],
  setup(props) {
    /// 声明接收一下echart,axios
    const store = useStore();
    //获取折叠栏状态
    let collapse = ref(computed(() => store.state.collapse));
    let $echarts = inject("echarts");
    let $axios = inject("axios");
    //reactive化
    let datas = reactive([]);
    let chart = reactive(null);
    //定时器id
    let timeId = null;
    let mytype = reactive(props.mytype);
    

    onMounted(() => {
      //防止渲染时未挂载，虽然不知道为什么会出这个bug
      nextTick(() => {
        initChart();
        update();
        startInterval();
      });
    });

    onUnmounted(() => {
      $echarts.dispose;
      clearInterval(timeId);
    });
    //初始化表格
    function initChart() {
      chart = $echarts.init(document.getElementById(props.myid));
      getdata();
      chart.setOption({
        //标题配置
        title: {
          text: "▎网页新增数量",
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
          name: "数量",
          show: true,
          right: 10,
          top: 10,
          textStyle: {
            color: "#fff",
          },
        },
        xAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#fff",
              width: 1, //这里是为了突出显示加上的
            },
          },
        },
        yAxis: {
          type: "category",
          data: ["七月", "八月", "九月", "十月", "十一月", "十二月"],
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
            name: "数量",
            type: mytype,
            label: {
              show: true,
              position: "right",
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
    }
    //获取并更新图表数据
    function update() {
      // console.log(props);
      getdata().then(() => {
        let dataOption = {
          series: [
            {
              data: datas,
            },
          ],
        };
        chart.setOption(dataOption);
      });
    }
    //axios获取数据
    async function getdata() {
      // await $axios
      //   .get("/api/testdata")
      //   .then(function (response) {
      //     console.log(response)
      //     datas = response.data.data.list.map((item) => {
      //       return item.age;
      //     });
      //   })
      //   .catch(function (error) {
      //     console.log(error);
      //   });

      await $axios
        .post("http://localhost:5000/vpw/getCrawledCount",{
          interval:'day',
          dateStart:'2022-1-22',
          dateEnd:'2022-01-27',
        })
        .then((response) => {
          // console.log(response)
          datas = response.data.data.map((item) =>{
            return item.count
          })
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
      }, 5000);
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

    return { getdata, datas, update, chart, initChart, startInterval,mytype};
  },
};
</script>

<style scoped lang="css">
.line-holder {
  height: 224px;
  border-radius: 5px;
  /* background-color: #0d265e; */
  margin: 6px;
  width: 100%;
  border: 1px solid;
  border-color: white;
}
</style>
