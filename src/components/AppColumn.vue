<template>
  <div class="line-holder" id="myid2"></div>
</template>

<script>
import {
  reactive,
  onMounted,
  onUnmounted,
  watch,
  computed,
  ref,
  nextTick,
} from "vue";
import { inject } from "vue";
import { useStore } from "vuex";
export default {
  name: "AppColumn",
  props: ["datas"],
  setup(props) {
    /// 声明接收一下echart,axios
    const store = useStore();
    //获取折叠栏状态
    let collapse = ref(computed(() => store.state.collapse));
    let $echarts = inject("echarts");
    let $axios = inject("axios");
    //reactive化
    let datas = reactive([]);
    console.log("props:",props.datas)
    let chart = reactive(null);
    //定时器id
    let timeId = null;

    onMounted(() => {
      //防止渲染时未挂载，虽然不知道为什么会出这个bug
      nextTick(() => {
        initChart();
        update();
      });
    });

    onUnmounted(() => {
      $echarts.dispose;
      clearInterval(timeId);
    });
    //初始化表格
    function initChart() {
      chart = $echarts.init(document.getElementById("myid2"));
      let dataOption = {
        // title: {
        //   text: '服务器软件信息'
        // },
        legend: {
          data: ["服务器软件信息"],
        },
        radar: {
          // shape: 'circle',
          indicator: [
            { name: "Nginx", max: 300 },
            { name: "CloudFlare", max: 300 },
            { name: "PHP", max: 300 },
            { name: "Microsoft ASP.NET", max: 300 },
            { name: "Apache", max: 300 },
            { name: "Windows Server", max: 300 },
          ],
        },
        series: [
          {
            type: "radar",
            data: [
              {
                value: [props.datas.Nginx, props.datas.CloudFlare, props.datas.PHP, props.datas["Microsoft ASP.NET"], props.datas["Apache"], props.datas["Windows Server"]],
                name: "服务器软件信息",
              },
            ],
          },
        ],
      };

      chart.setOption(dataOption);
      window.onresize = function () {
        //自适应大小
        chart.resize();
      };
    }
    //获取并更新图表数据
    function update() {
      // console.log(props);
      //   getdata().then(() => {
      //   });
    }
    //axios获取数据
    async function getdata() {
      await $axios
        .post("", {})
        .then((response) => {
          // console.log(response)
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

    return { getdata, datas, update, chart, initChart };
  },
};
</script>

<style scoped lang="css">
.line-holder {
  height: 400px;
  border-radius: 5px;
  /* background-color: #0d265e; */
  margin: 6px;
  width: 100%;
  border: 1px solid;
  border-color: white;
}
</style>
