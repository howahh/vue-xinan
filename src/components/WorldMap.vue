<template>
  <div id="con">
    <div class="map-holder" id="map"></div>
  </div>
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
    //地图json数据
    let mapData = reactive({});
    let chinaData = reactive({});
    //中文名称
    let nameMap = reactive({});
    let chart = reactive(null);
    let lowData = reactive([
    ]);
    let middleData = reactive([]);
    let highData = reactive([])
    let extraData = reactive([])
    //定时器id
    let timeId = null;

    // var place = reactive([{ name: "西藏", value: [32.31, 85.52] }]);

    onMounted(() => {
      nextTick(() => {
        getState().then(() => {
          initChart();
          update();
          // startInterval();
        });
      });
    });

    onUnmounted(() => {
      $echarts.dispose;
      clearInterval(timeId);
    });
    //获取地图json
    async function getState() {
      mapData = await $axios.get("http://localhost:3000/map/world.json");
      nameMap = await $axios.get("http://localhost:3000/map/mapChinaName.json");
      chinaData = await $axios.get("http://localhost:3000/map/USA_geo.json");
    }

    //初始化表格
    function initChart() {
      $echarts.registerMap("world", mapData.data);
      $echarts.registerMap("china", chinaData.data);
      chart = $echarts.init(document.getElementById("map"), "dark");
      getdata();
      let options = {
        title: {
          text: "▎ 地区分布",
          left: 20,
          top: 20,
          textStyle: {
            color: "#fff",
          },
        },

        geo: {
          map: "world",
          top: "5%",
          bottom: "5%",
          roam: true,
          label: {
            show: false,
          },
          // center:[50.46, 32.92],
          scaleLimit: {
            min: 0.85,
            max: 5,
          },
          nameMap: nameMap.data,
          itemStyle: {
            areaColor: "rgb(49,114,191,0.9)",
            borderColor: "#fff",
          },
        },
        legend: {
          left: "5%",
          bottom: "5%",
          orient: "vertical",
        },
      };
      chart.setOption(options);
      window.onresize = function () {
        //自适应大小
        chart.resize();
      };
      chart.on("click", async (arg) => {
        if (arg.name == "美国") {
          chart.setOption({
            geo: {
              map: "china",
              zoom: 1.6,
              center: [-100.445882, 39.7837304],
            },
          });
        }
      });
      let flag = 0;
      chart.getZr().on("click", async (arg) => {
        if (!arg.target) {
          if (flag == 0) {
            chart.setOption({
              geo: {
                map: "world",
                zoom:1.0,
                center: [10.46, 13.92],
              },
            });
          }
        }
      });
    }
    //获取并更新图表数据
    function update() {
      getdata().then(() => {
        console.log("hello");
        let dataOption = {
          series: [
            {
              type: "effectScatter",
              rippleEffect: {
                scale: 1,
                brushType: "stroke",
              },
              symbolSize:6,
              itemStyle: {
                color: "#388E3C",
              },
              name: "低威胁",
              nameStyle: {
                color: "#fff",
              },
              legend: {
                show: false,
              },
              label: {
                show: true,
                color: "#fff",
                offset: [20, 20],
                formatter: "{b}",
              },
              data: lowData,
              coordinateSystem: "geo",
            },
            {
              type: "effectScatter",
              rippleEffect: {
                scale: 2,
                brushType: "stroke",
              },
              symbolSize:6,
              itemStyle: {
                color: "#FFEB3B",
              },
              name: "中威胁",
              nameStyle: {
                color: "#fff",
              },
              legend: {
                show: false,
              },
              label: {
                show: true,
                color: "#fff",
                offset: [20, 20],
                formatter: "{b}",
              },
              data: middleData,
              coordinateSystem: "geo",
            },
                        {
              type: "effectScatter",
              rippleEffect: {
                scale: 3,
                brushType: "stroke",
              },
              itemStyle: {
                color: "#FF5722",
              },
              name: "高威胁",
              nameStyle: {
                color: "#fff",
              },
              legend: {
                show: false,
              },
              label: {
                show: true,
                color: "#fff",
                offset: [20, 20],
                formatter: "{b}",
              },
              data: highData,
              coordinateSystem: "geo",
            },
            {
              type: "effectScatter",
              rippleEffect: {
                scale: 7,
                brushType: "stroke",
              },
              symbolSize:11,

              itemStyle: {
                color: "#D32F2F",
              },
              name: "超高威胁",
              nameStyle: {
                color: "#fff",
              },
              legend: {
                show: false,
              },
              label: {
                show: true,
                color: "#fff",
                offset: [20, 20],
                formatter: "{b}",
              },
              data: extraData,
              coordinateSystem: "geo",
            },
          ],
        };
        chart.setOption(dataOption);
      });
    }
    //axios获取数据
    async function getdata() {
      await $axios
        .post("http://localhost:5000/vpw/getLocAndStatus")
        .then(function (response) {
          console.log(response);
          //低
          datas = response.data.data[0].map((item) => {
            return item;
          });
          // console.log("ts",datas)
          for (var i in datas) {
            lowData.push({ value: datas[i].loc });
          }
          //中
          datas = response.data.data[1].map((item) => {
            return item;
          });
          for (var i in datas) {
            middleData.push({ value: datas[i].loc });
          }
          //高
          datas = response.data.data[2].map((item) => {
            return item;
          });
          for (var i in datas) {
            highData.push({ value: datas[i].loc });
          }
          //极高
          datas = response.data.data[3].map((item) => {
            return item;
          });
          for (var i in datas) {
            extraData.push({ value: datas[i].loc });
          }
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

    return {
      getdata,
      datas,
      update,
      chart,
      initChart,
      startInterval,
      lowData,
      middleData,
      highData,
      extraData
    };
  },
};
</script>

<style scoped lang="css">
.map-holder {
  height: 456px;
  /* background-image:url('../assets/img/img.jpg');
  background-size: 100% 100%; */
  border-radius: 5px;
  margin: 6px;
  width: 100%;
  border: 1px solid;
  border-color: white;
}
</style>
