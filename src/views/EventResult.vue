<template>
  <a-row style="margin: 20px">
    <a-col style="width: 100%">
      <div class="myTable">
        <a-table
          :dataSource="
            data.slice((currentPage - 1) * pageSize, currentPage * pageSize)
          "
          :columns="columns"
          :customRow="rowClick"
          :pagination="false"
          bordered
          :scroll="{ y: 375 }"
        />
        <div class="tableHandel" style="margin: 10px">
          <a-pagination
            showSizeChanger
            showQuickJumper
            v-model:pageSize="pageSize"
            v-model:current="currentPage"
            :pageSizeOptions="['5', '10', '20']"
            :total="data.length"
            @change="changeCureentPage"
          >
          </a-pagination>
        </div>
      </div>
    </a-col>
  </a-row>
  <a-row style="margin: 20px">
    <a-col :span="10" :offset="1">
      <div style="font-size: 20px">侵权电影：</div>
      <br />
      <!-- <scoll-movie style="background-color: white" :datas="url" v-if="isMovie" /> -->
      <vue-seamless-scroll :data="datas"></vue-seamless-scroll>
    </a-col>
    <a-col :span="10" :offset="1">
      <div style="font-size: 20px">网站截图：</div>
      <br />
      <img style="width: 100%" src="../assets/img/logoin.jpg" alt="" />
    </a-col>
  </a-row>
  <a-row style="margin: 20px">
    <a-col :span="10" :offset="1">
      <div style="font-size: 20px">测试：</div>
      这里是一个echarts图表
    </a-col>
    <a-col :span="10" :offset="1">
      <div style="font-size: 20px">测试2：</div>
      这里是另一个echarts图表
    </a-col>
  </a-row>
</template>
<script>
import { SmileOutlined, DownOutlined } from "@ant-design/icons-vue";
import { ref, inject, onBeforeMount, reactive } from "vue";
import ScollMovie from "../components/ScollMovie.vue";
import vueSeamlessScroll from "vue-seamless-scroll";
import ScollExample from "../components/ScollExample.vue";
const columns = [
  {
    title: "标题",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "域名",
    dataIndex: "host",
    key: "domain",
  },
  {
    title: "IP地址",
    key: "ip_address",
    dataIndex: "ip",
  },
  {
    title: "地理位置",
    key: "loc",
    dataIndex: "geo",
  },
  {
    title: "服务器软件",
    key: "app",
    dataIndex: "app",
  },
  {
    title: "协议",
    key : "protocol",
    dataIndex: "protocol"
  },
  {
    title: "端口",
    key: "port",
    dataIndex : "port"
  },
  {
    title: "探测时间",
    key: "time",
    dataIndex: "addTime",
  },
];

export default {
  components: {
    SmileOutlined,
    DownOutlined,
    ScollMovie,
    ScollExample,
    vueSeamlessScroll
  },
  setup() {
    let pageSize = ref(10);
    var $axios = inject("axios");
    let currentPage = ref(1);
    var data = reactive([]);
    var movies = reactive([]);
    onBeforeMount(() => {
      getData();
    });

    function rowClick(record, index){
        return{
            onClick: (event) => {
                console.log(record.host);
                getScollMovie(record.host);
            }
        }
    }

    function getScollMovie(domain){
        $axios.post("http://localhost:5000/movie/getMovieInPage",{
            start:0,
            count:100,
            site:domain
        }).then((response)=>{
            console.log(response);
        })
    }

    function getData() {
      $axios
        .post("http://localhost:5000/vpw/getVpwHaveMovieAndInfo")
        .then((response) => {
          for (var i = 0; i < response.data.data.length; i++) {
            data.push(response.data.data[i]);
          }
        });
    }

    function changeCureentPage(page, newPageSize) {
      currentPage.value = page;
      pageSize.value = newPageSize;
    }

    return {
      changeCureentPage,
      pageSize,
      currentPage,
      columns,
      data,
      rowClick,
      getScollMovie
    };
  },
};
</script>