<template>
  <div :id="myid" class="pie-holder"></div>
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
  name: "Pie",
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
    let chart = reactive(null);
    //定时器id
    let timeId = null;

    onMounted(() => {
      //防止渲染时未挂载，虽然不知道为什么会出这个bug
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
      chart = $echarts.init(document.getElementById(props.myid), "dark");
      getdata().then(() => {
        console.log("onMounted", datas);
        chart.setOption({
          //标题配置
          title: {
            text: "▎网页分类",
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
          //图例的展示，通过name与series里对应
          legend: {
            // name:"数量",
            show: false,
            right: 10,
            top: 10,
            icon: "circle",
            type:"scroll"
          },

          //鼠标在图上时的具体信息展示
          tooltip: {
            show: true,
            trigger: 'item',
          },
          series: [
            {
              // name: "数量",
              type: "pie",
              legendHoverLink :true,
              label: {
                show: true,
                position: "inside",
                color:"#fff"
              },
              emphasis: {
                label: {
                  show: true,
                },
                labelLine: {
                  show: false,
                },
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
            return {value:item.age,name:item.name};
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

<style>
.pie-holder {
  height: 224px;
  border-radius: 5px;
  background-color: #020f2e;
  margin: 6px;
  width: 100%;
}
</style>