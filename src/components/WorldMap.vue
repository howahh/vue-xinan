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
    let testData = reactive([
      { name: "北京", value: [116.46, 39.92, 4367] },
      { name: "上海", value: [121.48, 31.22, 8675] },
      { name: "广州", value: [113.23, 23.16, 187] },
      { name: "西安", value: [108.45, 34, 3421] },
    ]);
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
      chinaData = await $axios.get("http://localhost:3000/map/china.json");
    }

    //初始化表格
    function initChart() {
      $echarts.registerMap("world", mapData.data);
      $echarts.registerMap("china", chinaData.data);
      chart = $echarts.init(document.getElementById("map"));
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
            // emphasis: {
            //   focus: 'self',
            // },
          },
          regions: [
            {
              name: "美国",
              itemStyle: {
                areaColor: "#fff",
                borderColor: "red",
              },
            },
          ],
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
        if (arg.name == "中国") {
          chart.setOption({
            geo: {
              map: "china",
              center:[110.46, 35.92]
            },
          });
        }
      });
      // let barOption = {
      //   xAxis: {
      //     type: "value",
      //   },
      //   yAxis: {
      //     type: "category",
      //     data: testData.map(function (item) {
      //       return item.name;
      //     }),
      //   },
      //   series: {
      //     type: "bar",
      //     data: testData.map(function (item) {
      //       return item.value[3];
      //     }),
      //     // universalTransition: true,
      //   },
      // };
      let flag = 0;
      chart.getZr().on("click", async (arg) => {
        if (!arg.target) {
          if (flag == 0) {
            chart.setOption({
              geo: {
                map: "world",
                center:[10.46, 13.92]
              },
              // flag=1
            });
          }
          // else if(flag==1){
          //   chart.setOption(barOption)
          //   flag=0
          // }
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
                scale: 5,
                brushType: "stroke",
              },
              itemStyle: {
                color: "#FF6666",
              },
              name: "威胁",
              label:{
                show:true,
                color: "#fff",
                offset:[20,20],
                formatter:'{b}'
              },
              data: testData,
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
      testData,
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
