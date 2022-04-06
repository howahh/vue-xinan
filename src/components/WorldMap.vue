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
    //地图json数据
    let mapData = reactive({});
    //中文名称
    let nameMap = reactive({});
    let chart = reactive(null);
    //定时器id
    let timeId = null;

    onMounted(() => {
      nextTick(() => {
        getState().then(() => {
          // console.log("map", nameMap);
          initChart();
        });
        // update()
        // startInterval();
      });
    });

    onUnmounted(() => {
      $echarts.dispose;
      clearInterval(timeId);
    });
    //获取地图json
    async function getState() {
      mapData = await $axios.get("http://localhost:3000/map/world_new.json");
      nameMap = await $axios.get("http://localhost:3000/map/mapChinaName.json");
    }

    //初始化表格
    function initChart() {
      $echarts.registerMap("world", mapData.data);
      chart = $echarts.init(document.getElementById("map"),);
      getdata();
      chart.setOption({
        title: {
          text: "▎ 地区分布",
          left: 20,
          top: 20,
          textStyle: {
            color:'#fff'
          }
        },
        // visualMap: {
        //   left: "right",
        //   min: 500000,
        //   max: 38000000,
        //   inRange: {
        //     // prettier-ignore
        //     color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'],
        //   },
        //   text: ["High", "Low"],
        //   calculable: true,
        // },
        geo: {
          map: "world",
          top: "5%",
          bottom: "5%",
          roam: true,
          label: {
            show: false,
            // textBorderColor:'white',i i
            // color: "#fff",
            // fontSize:20,
          },
          scaleLimit: {
            min: 1,
            max: 5,
          },
          nameMap: nameMap.data,
          itemStyle: {
            areaColor: "rgb(49,114,191,0.5)",
            borderColor: "#fff",
            // borderType: "dotted",
          },
        },
        legend: {
          left: "5%",
          bottom: "5%",
          orient: "vertical",
        },
      });
      window.onresize = function () {
        //自适应大小
        chart.resize();
      };
    }
    //获取并更新图表数据
    function update() {
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
  border-color:white;
}
</style>
