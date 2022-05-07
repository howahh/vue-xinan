<template>
  <a-row style="margin: 20px">
    <a-col style="width: 100%">
      <a-card
        style="background-color: white; border-radius: 20px"
        :hoverable="true"
      >
        <!-- <alert-two-tone style="font-size:40px; margin-left:28x" /> -->
        <security-scan-filled style="font-size: 40px; margin-left: 30px" />
        <div style="margin: 20px">
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
            <br />
          </div>
        </div>
      </a-card>
    </a-col>
  </a-row>
  <a-spin :spinning="spin1" v-if="flag">
    <a-row style="margin: 20px">
      <a-col :span="10" :offset="1">
        <a-card
          style="background-color: white; border-radius: 20px"
          :hoverable="true"
        >
          <div style="font-size: 20px; margin-left: 20px">侵权资源作品：</div>
          <a-divider />
          <!-- <br /> -->
          <div class="scoll-container">
            <div class="scoll">
              <div v-for="(item, index) in movies" :key="index">
                <div class="data-list">
                  <a-row>
                    <a-col :span="8" :offset="1">{{ item.title }}</a-col>
                    <a-col :span="12" :offset="1">{{ item.url }}</a-col>
                  </a-row>
                </div>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="10" :offset="1">
        <a-card
          style="background-color: white; border-radius: 20px"
          :hoverable="true"
        >
          <div style="font-size: 20px">网站截图：</div>
          <a-divider />

          <a-image style="width: 100%" :src="url_movie" alt="" />
        </a-card>
      </a-col>
    </a-row>
  </a-spin>
  <a-spin :spinning="spin1" v-if="flag_chart">
    <a-row style="margin: 20px">
      <a-col :span="10" :offset="1">
        <a-card style="border-radius: 20px" :hoverable="true">
          <IsMovie :num="num" />
        </a-card>
      </a-col>
      <a-col :span="10" :offset="1">
        <a-card style="border-radius: 20px" :hoverable="true">
          <AppColumn :datas="json" />
        </a-card>
      </a-col>
    </a-row>
  </a-spin>
</template>
<script>
import { SmileOutlined, DownOutlined } from "@ant-design/icons-vue";
import { ref, inject, onBeforeMount, reactive } from "vue";
import ScollMovie from "../components/ScollMovie.vue";
// import vueSeamlessScroll from "vue-seamless-scroll";
import ScollExample from "../components/ScollExample.vue";
import { AlertTwoTone, SecurityScanFilled } from "@ant-design/icons-vue";
import IsMovie from "../components/IsMovie.vue";
import AppColumn from "../components/AppColumn.vue";
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
    key: "protocol",
    dataIndex: "protocol",
  },
  {
    title: "端口",
    key: "port",
    dataIndex: "port",
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
    AlertTwoTone,
    SecurityScanFilled,
    IsMovie,
    AppColumn,
    // vueSeamlessScroll
  },
  setup() {
    let pageSize = ref(10);
    var $axios = inject("axios");
    let currentPage = ref(1);
    var data = reactive([]);
    var movies = reactive([]);
    var theID = ref(0);
    let flag = ref(false);
    let spin1 = ref(true);
    let num = ref(0);
    let flag_chart = ref(false);
    let apps = reactive([]);
    var json = reactive([]);
    var url_movie = ref("");

    onBeforeMount(() => {
      getData();
    });

    function rowClick(record, index) {
      return {
        style: {
          "background-color": record.host === theID.value ? "	#DCDCDC" : "",
        },
        onClick: (event) => {
          url_movie.value = "http://localhost:5000/apiRequestSender/query/getScreenshot?domain=" + record.host
          flag.value = true;
          spin1.value = true;
          flag_chart.value = true;
          setTimeout(() => {
            spin1.value = false;
          }, 3000);
          theID.value = record.host;
          var length = movies.length;
          for (var i = 0; i < length; i++) {
            movies.pop();
          }
          //   console.log(record.host);
          getScollMovie(record.host);
        },
      };
    }

    function getScollMovie(domain) {
      $axios
        .post("http://localhost:5000/movie/getMovieInPage", {
          start: 0,
          count: 100,
          site: domain,
        })
        .then((response) => {
          //   console.log(response.data.data);
          for (var i = 0; i < response.data.data.length; i++) {
            var name = response.data.data[i].name;
            var url = response.data.data[i].link;
            if (name.length > 9) {
              name = name.substring(0, 9) + "...";
            }
            movies.push({
              title: name,
              url: url,
            });
          }
          //   if (movies.length > 20) {
          //     movies = movies.slice(0, 20);
          //   }
          while (movies.length >= 20) {
            movies.pop();
          }
          var temp = movies.concat();
          while (movies.length < 120) {
            for (var i = 0; i < temp.length; i++) {
              movies.push(temp[i]);
            }
          }
          //   console.log(movies.length);
          //   console.log(movies);
        });
    }

    function getData() {
      $axios
        .post("http://localhost:5000/vpw/getVpwHaveMovieAndInfo")
        .then((response) => {
          for (var i = 0; i < response.data.data.length; i++) {
            data.push(response.data.data[i]);
            var temp = response.data.data[i].app.split(",");
            for (var j = 0; j < temp.length; j++) {
              var flag = 0;
              for (var o = 0; o < apps.length; o++) {
                temp[j] = temp[j].split("/")[0];
                if (apps[o] === temp[j]) {
                  flag = 1;
                }
              }
              if (flag == 0) {
                apps.push(temp[j]);
              }
            }
          }
          //   console.log(apps);
          for (var i = 0; i < apps.length; i++) {
            json[apps[i]] = 0;
          }
          for (var i = 0; i < response.data.data.length; i++) {
            var temp = response.data.data[i].app.split(",");
            for (var j = 0; j < temp.length; j++) {
              //   console.log(temp[j])
              var item = temp[j].split("/")[0];
              json[item] += 1;
            }
          }
          //   console.log(json);
          num.value = data.length;
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
      getScollMovie,
      movies,
      flag,
      spin1,
      num,
      flag_chart,
      json,
      url_movie,
    };
  },
};
</script>

<style lang="scss" scoped>
.scoll-container {
  height: 300px;
  overflow: hidden;
  background-color: white;
}
.scoll {
  margin: 20px;
  animation: myScoll 40s linear infinite;
}
.scoll:hover {
  animation-play-state: paused;
}
@keyframes myScoll {
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(-50%);
  }
}
</style>

 