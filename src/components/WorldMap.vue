<template>
  <div id="con" @dblclick="revertMap">
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
          scaleLimit: {
            min: 0.85,
            max: 5,
          },
          nameMap: nameMap.data,
          itemStyle: {
            areaColor: "rgb(49,114,191)",
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
            },
          });
        }
      });
      chart.getZr().on("click", async (arg) => {
        if (!arg.target) {
          console.log(arg)
          chart.setOption({
            geo: {
              map: "world",
            },
          });
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
              data: [
                { name: "北京", value: [116.46, 39.92, 4367] },
                { name: "上海", value: [121.48, 31.22, 8675] },
                { name: "广州", value: [113.23, 23.16, 187] },
                { name: "西安", value: [108.45, 34, 3421] },
              ],
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

    return { getdata, datas, update, chart, initChart, startInterval };
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
