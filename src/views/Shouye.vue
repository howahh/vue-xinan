<template >
  <!-- <button @click="update">aaa</button> -->
  <div class="container">
    <el-row :gutter="5">
      <!-- 左侧两个 -->
      <el-col :span="6">
        <!-- 系统运行状态 -->
        <el-card shadow="hover" class="mgb20" style="height: 224px"> </el-card>
        <el-card shadow="hover" style="height: 224px"> </el-card>
      </el-col>
      <!-- 地图 -->
      <el-col :span="12">
        <el-card shadow="hover" style="height: 453px" id="map"></el-card>
      </el-col>
      <!-- 右边两列 -->
      <el-col :span="6">
        <el-card shadow="hover" class="mgb20" style="height: 224px" id="test">
        </el-card>

        <el-card id="test" shadow="hover" style="height: 224px"> </el-card>
      </el-col>
      <!-- 下面的一行 -->
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card shadow="hover" style="height: 220px"> </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { reactive, onMounted, onUnmounted, onBeforeMount } from "vue";
import LittleChart from "../components/LittleChart.vue";
import { inject } from "vue";
export default {
  name: "echartsBox",
  components: {
    LittleChart,
  },
  setup() {
    /// 声明接收一下echart,axios
    let $echarts = inject("echarts");
    let $axios = inject("axios");
    //reactive化
    let datas = reactive([]);
    let chart = reactive(null);
    //定时器id
    let timeId = null;

    onMounted(() => {
      initChart();
      startInterval();
    });

    onUnmounted(() => {
      $echarts.dispose;
      clearInterval(timeId);
    });
    //初始化表格
    function initChart() {
      chart = $echarts.init(document.getElementById("test"), "dark");
      getdata().then(() => {
        console.log("onMounted", datas);
        // chart.setOption({
        //   title: {
        //     text: "网站数量",
        //     textStyle: { fontSize: 18, fontWeight: "bolder", color: "#fff" },
        //     x:'center'
        //   },
        //   legend:{},
        //   xAxis: {
        //     type: "category",
        //     data: ["七月", "八月", "九月", "十月", "十一月", "十二月"],
        //   },
        //   tooltip: {
        //     trigger: "axis",
        //   },
        //   yAxis: {
        //     type: "value",
        //   },
        //   series: [
        //     {
        //       type: "line",
        //       smooth: true,
        //       data: datas,
        //       areaStyle: {},
        //     },
        //   ],
        // });
        chart.setOption({
          title: {
            text: "▎商家销售统计",
            left: 20,
            top: 20,
          },
          grid: {
            top: "20%",
            left: "3%",
            right: "6%",
            bottom: "3%",
            containLabel: true, // 距离是包含坐标轴上的文字
          },
          legend:{
            show:true,
          },
          xAxis: {
            type: "value",
          },
          yAxis: {
            type: "category",
            data: ["七月", "八月", "九月", "十月", "十一月", "十二月"],
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

    return { getdata, datas, update, chart, initChart, startInterval };
  },
};
</script>

<style scoped lang="css">
.el-row {
  margin: 5px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 0px;
  margin: 0px;
}
.el-card {
  padding: 0px;
  margin: 5px;
  /* margin-bottom: 10px;  */
  background-color: #0d265e;
}
.el-card /deep/ .el-card__body {
  padding: 0px;
}
#hhh {
  /* height: 224px; */
  width: 100%;
}
</style>