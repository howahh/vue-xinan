<template>
  <div :id="myid" class="circle-holder"></div>
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
  name: "Circle",
  props: ["myid"],
  setup(props) {
    /// 声明接收一下echart,axios
    const store = useStore();
    //获取折叠栏状态
    let collapse = ref(computed(() => store.state.collapse));
    let $echarts = inject("echarts");
    let $axios = inject("axios");
    //reactive化
    let datas = reactive([
      {value:52,name:"爬虫1"},
      {value:27,name:"爬虫2"},
      {value:100,name:"爬虫3"},
      {value:33,name:"检测1"},
      {value:100,name:"检测2"},
      {value:100,name:"检测3"},
      
    ]);
    let chart = reactive(null);
    //定时器id
    let timeId = null;
    onMounted(() => {
      //防止渲染时未挂载，虽然不知道为什么会出这个bug
      // nextTick(() => {
      //   initChart();
      //   update();F
      //   startInterval();
      // });
      initChart();
      update();
      // startInterval();
    });

    onUnmounted(() => {
      $echarts.dispose;
      clearInterval(timeId);
    });
    //初始化表格
    function initChart() {
      chart = $echarts.init(document.getElementById(props.myid));
      const centerPointers = [
        ["18%", "40%"],
        ["50%", "40%"],
        ["82%", "40%"],
        ["18%", "75%"],
        ["50%", "75%"],
        ["82%", "75%"],
      ];
      const titleFontSize =
        (document.getElementById(props.myid).offsetWidth / 100) * 3.6;
      const innerRadius = titleFontSize * 2.8;
      const outterRadius = innerRadius * 1.125;
      chart.setOption({
        //标题配置
        title: {
          text: "▎任务运行情况",
          left: 10,
          top: 10,
          textStyle: {
            color: "#fff",
          },
        },
        series: [
          {
            type: "pie",
            center: centerPointers[0],
            hoverAnimation: false,
            radius: [outterRadius, innerRadius],
            label: {
              show: true,
              position: "center",
              fontSize: titleFontSize,
            },
            labelLine: {
              show: false,
            },
          },
          {
            type: "pie",
            center: centerPointers[1],
            hoverAnimation: false,
            radius: [outterRadius, innerRadius],
            label: {
              show: true,
              position: "center",
              fontSize: titleFontSize,
            },
            labelLine: {
              show: false,
            },
          },
          {
            type: "pie",
            center: centerPointers[2],
            hoverAnimation: false,
            radius: [outterRadius, innerRadius],
            label: {
              show: true,
              position: "center",
              fontSize: titleFontSize,
            },
            labelLine: {
              show: false,
            },
          },
          {
            type: "pie",
            center: centerPointers[3],
            hoverAnimation: false,
            radius: [outterRadius, innerRadius],
            label: {
              show: true,
              position: "center",
              fontSize: titleFontSize,
            },
            labelLine: {
              show: false,
            },
          },
          {
            type: "pie",
            center: centerPointers[4],
            hoverAnimation: false,
            radius: [outterRadius, innerRadius],
            label: {
              show: true,
              position: "center",
              fontSize: titleFontSize,
            },
            labelLine: {
              show: false,
            },
          },
          {
            type: "pie",
            center: centerPointers[5],
            hoverAnimation: false,
            radius: [outterRadius, innerRadius],
            label: {
              show: true,
              position: "center",
              fontSize: titleFontSize,
            },
            labelLine: {
              show: false,
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
      getdata().then(() => {
        // console.log("updated", datas);
        const colorArrs = [
          ["#4FF778", "#0BA82C"],
          ["#E5DD45", "#E8B11C"],
          ["#E8821C", "#E55445"],
          ["#5052EE", "#AB6EE5"],
          ["#23E5E5", "#2E72BF"],
          ["#4FF778", "#0BA82C"],
        ];

        const seriesData = datas.map((item, index) => {
          return {
            label: {
              position: "center",
              color: colorArrs[index][1],
              hoverAnimation: false,
              show: true,
            },
            data: [
              {
                name: item.name + "\n\n" + item.value+"%",
                value: item.value,
                itemStyle: {
                  color: new $echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      offset: 0,
                      color: colorArrs[index][0],
                    },
                    {
                      offset: 1,
                      color: colorArrs[index][1],
                    },
                  ]),
                },
              },
              {
                // value: item.value,
                itemStyle: {
                  color: "#333843",
                },
              },
            ],
          };
        });
        console.log("123",seriesData)
        // console.log(seriesData)
        let dataOption = {
          series: seriesData,
        };
        chart.setOption(dataOption);
      });
    }
    //axios获取数据
    async function getdata() {
      await $axios
        .get("/api/testdata")
        .then(function (response) {
          // data = response.data.data.list.map((item) => {
          //   return { value: item.age, name: item.name };
          // });
          console.log(datas)
        })
        .catch(function (error) {
          console.log(error);
        });
      // console.log("get里",datas)
    }
    //定时获取数据
    function startInterval() {
      if (timeId) {
        clearInterval(timeId);
      }
      timeId = setInterval(() => {
        update();
        // console.log("定时器中",datas)
      }, 3000);
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
<style>
.circle-holder {
  height: 224px;
  border-radius: 5px;
  /* background-color: #020f2e; */
  margin: 6px;
  width: 100%;
  border: 1px solid;
  border-color: white;
}
</style>
