<template>
  <el-row >
    <el-col :span="5" :offset="1" class="mycard">1</el-col>
    <el-col :span="5" :offset="1" class="mycard">2</el-col>
    <el-col :span="5" :offset="1" class="mycard">3</el-col>
    <el-col :span="5" :offset="1" class="mycard">4</el-col>

  </el-row>
  <el-row>
    <el-col :span="7" :offset="1"
      ><div class="chart-content bg-purple">
        <Lines myid="hh" />
      </div>
    </el-col>
    <el-col :span="7" :offset="1"
      ><div class="chart-content bg-purple">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              Card name
              <el-button class="button" type="text">Operation button</el-button>
            </div>
          </template>
          <div v-for="o in 8" :key="o" class="text item">
            {{ "List item " + o }}
          </div>
        </el-card>
      </div></el-col
    >
    <el-col :span="7" :offset="1">
      <div class="chart-content bg-purple">
        <Lines myid="1hh" />
      </div>
    </el-col>
  </el-row>
  <el-row :gutter="10">
    <el-col :span="16" :offset="1"
      ><div class="table-content bg-purple">
        <div class="table-in">
          <el-table
            :data="
              newData.slice(
                (currentPage - 1) * pageSize,
                currentPage * pageSize
              )
            "
            style="width: 100%"
            max-height="417"
            border
            ref="myTable"
            highlight-current-row
            @current-change="selectCurrentChange"
            :key="updateKey"
          >
            <!-- <el-table-column type="selection" width="55" /> -->
            <el-table-column fixed prop="id" label="任务id" width="50" />
            <el-table-column prop="job" label="任务名称" width="220" />
            <el-table-column prop="project" label="任务种类" width="150" />
            <el-table-column prop="spider" label="爬虫类型" width="120" />
            <el-table-column prop="pages" label="页面数量" width="120" />
            <el-table-column prop="items" label="获取数量" width="120" />
            <el-table-column
              fixed="right"
              prop="status"
              label="任务管理"
              width="180"
            >
              <template #default="scope"
                ><el-button
                  v-if="scope.row.status === '正在运行'"
                  type="success"
                  round
                  size="small"
                  :disabled="scope.row.disabled"
                  @click="stopHandle(scope.row.id, scope.row)"
                >
                  停止
                </el-button>
                <el-button
                  v-if="scope.row.status === '已停止'"
                  type="danger"
                  round
                  size="small"
                  :disabled="true"
                >
                  已关闭
                </el-button>

                <el-button
                  type="warning"
                  round
                  size="small"
                  :disabled="true"
                  >{{scope.row.status}}</el-button
                ></template
              >
            </el-table-column>
          </el-table>
          <div id="change">
            <el-pagination
              background
              :page-sizes="[5, 10, 20]"
              v-model:page-size="pageSize"
              layout="sizes ,prev, pager, next ,jumper"
              :total="newData.length"
              :page-size="pageSize"
              @current-change="handleCurrentChange"
            />
          </div>
        </div></div
    ></el-col>
    <el-col :span="7"
      ><div class="table-content bg-purple">
        <el-descriptions :column="1" border>
          <el-descriptions-item
            label="任务id"
            label-align="right"
            align="center"
          >
            {{ myId }}
          </el-descriptions-item>
          <el-descriptions-item
            label="任务名称"
            label-align="right"
            align="center"
          >
            {{ myJob }}
          </el-descriptions-item>
          <el-descriptions-item
            label="任务状态"
            label-align="center"
            align="center"
          >
            <el-tag class="ml-2" type="danger" size="small" effect="plain">{{
              myStatus
            }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item
            label="任务种类"
            label-align="center"
            align="center"
          >
            <el-tag class="ml-2" type="warning" size="small" effect="plain">{{
              myProject
            }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item
            label="爬虫种类"
            label-align="center"
            align="center"
          >
            {{ mySpider }}
          </el-descriptions-item>
          <el-descriptions-item
            label="开始时间"
            label-align="center"
            align="center"
          >
            {{ myCreateTime }}
          </el-descriptions-item>
          <el-descriptions-item
            label="结束时间"
            label-align="center"
            align="center"
          >
            {{ myFinish }}
          </el-descriptions-item>
          <el-descriptions-item
            label="运行总时间"
            label-align="center"
            align="center"
          >
            {{ myRuntime }}
          </el-descriptions-item>
          <el-descriptions-item
            label="页面总数"
            label-align="center"
            align="center"
          >
            <el-tag class="ml-2" type="success" size="small" effect="dark">{{
              myPages
            }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item
            label="元素数量"
            label-align="center"
            align="center"
          >
            <el-tag class="ml-2" type="info" size="small" effect="dark">
              {{ myItems }}</el-tag
            >
          </el-descriptions-item>
        </el-descriptions>
      </div></el-col
    >
  </el-row>
</template>

<script>
import dayjs from "dayjs";
import {
  reactive,
  ref,
  computed,
  onMounted,
  toRaw,
  inject,
  onBeforeMount,
  onUpdated,
} from "vue";

import Lines from "../components/Lines.vue";

export default {
  name: "EventHandler",
  components: {
    Lines,
  },
  setup() {
    let $axios = inject("axios");
    const now = new Date();
    //用于获取table
    let myTable = ref(null);
    // 当前页
    let currentPage = ref(1);
    //展示多少行
    let pageSize = ref(10);
    let updateKey = reactive(1);
    let rowId = ref(1);
    // 控制button
    let stopButton = ref(1);
    let deleteButton = ref(1);
    let myTest = ref(1);

    //数据
    let newData = reactive([]);
    //展示数据预先设置
    let myId = ref();
    let myJob = ref();
    let myStatus = ref();
    let mySpider = ref();
    let myCreateTime = ref();
    let myFinish = ref();
    let myRuntime = ref();
    let myPages = ref();
    let myItems = ref();
    let myProject = ref();

    onBeforeMount(() => {
      getData().then(() => {
        setFirst();
        setMyInfo();
      });
    });

    onMounted(() => {});
    //获取后端数据
    async function getData() {
      await $axios
        .post("http://localhost:5000/apiRequestSender/query/listJobs")
        .then((response) => {
          for (var key in response.data) {
            if (response.data[key].status == 2) {
              response.data[key].status = "已停止";
            } else if (response.data[key].status == 1) {
              response.data[key].status = "正在运行";
            }
            if (response.data[key].project == "movieCrawler") {
              response.data[key].project = "电影获取";
            } else if (response.data[key].project == "siteCrawler") {
              response.data[key].project = "站点获取";
            } else if (response.data[key].project == "splashHtmlCrawler") {
              response.data[key].project = "Html处理";
            }
            newData.push(response.data[key]);
          }
          newData.sort((item1, item2) => {
            // console.log(item1["create_time"])
            return (
              Date.parse(item2["create_time"]) -
              Date.parse(item1["create_time"])
            );
          });
          // console.log(newData);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    //改变当前在那一页
    const handleCurrentChange = (val) => {
      currentPage.value = val;
      // newData.value.setCurrentRow();
    };
    //单选一行的操作，显示该行详细信息
    const selectCurrentChange = (currentRow, oldCurrentRow) => {
      if (currentRow) {
        rowId.value = parseInt(currentRow.id);
      }
      setMyInfo();
    };
    //通过id获取该条信息
    const allInfo = () => {
      for (var i = 0; i < newData.length; i++) {
        if (newData[i].id == rowId.value) {
          return newData[i];
        }
      }
    };
    //配置要展示的信息
    const setMyInfo = () => {
      myId.value = allInfo().id;
      myJob.value = allInfo().job;
      myStatus.value = allInfo().status;
      mySpider.value = allInfo().spider;
      myCreateTime.value = allInfo().create_time;
      myFinish.value = allInfo().finish;
      myRuntime.value = allInfo().runtime;
      myPages.value = allInfo().pages;
      myItems.value = allInfo().items;
      myProject.value = allInfo().project;
    };
    //控制stopbutton
    const stopHandle = (id, row) => {
      row.disabled = true;
      row.status = "已停止";
      let sendPorject = row.project
      if(sendPorject == "电影获取"){
        sendPorject = "movieCrawler"
      }
      else if(sendPorject == "站点获取"){
        sendPorject = "siteCrawler"
      }
      else if(sendPorject == "Html处理"){
        sendPorject = "splashHtmlCrawler"
      }
      //发送请求给后端
      $axios.post("http://localhost:5000/apiRequestSender/query/stopSpider",
      {
        job:row.job,
        project:sendPorject,
      })
      .then(function (response){
        // console.log(response)
      })
      .catch(function (error) {
          console.log(error);
        });
      $axios.post("http://localhost:5000/apiRequestSender/query/stopSpider",
      {
        job:row.job,
        project:sendPorject,
      })
      .then(function (response){
        // console.log(response)
      })
      .catch(function (error) {
          console.log(error);
        });
      // setTimeout(getData(),5000)
    };
    const deleteHandle = (id, row) => {};

    //设置第一次选中和信息选择
    const setFirst = () => {
      myTable.value.setCurrentRow(myTable.value.data[0]);
    };
    const deleteRow = (index) => {
      tableData.value.splice(index, 1);
    };

    return {
      deleteRow,
      stopHandle,
      deleteHandle,
      deleteButton,
      stopButton,
      currentPage,
      pageSize,
      handleCurrentChange,
      updateKey,
      selectCurrentChange,
      myTable,
      allInfo,
      setFirst,
      rowId,
      getData,
      newData,
      myId,
      myJob,
      myStatus,
      myCreateTime,
      mySpider,
      myItems,
      myProject,
      myPages,
      myRuntime,
      myFinish,
      setMyInfo,
    };
  },
};
</script>

<style>
.el-row {
  margin-bottom: 20px;
}
.mycard{
  margin-top: 20px;
  background-color:black;
}
.el-col {
  border-radius: 4px;
}
.chart-content {
  border-radius: 4px;
  height: 260px;
  left: 2px;
}
.bg-purple {
  background-color: #fff;
}
.table-content {
  border-radius: 4px;
  height: 472px;
  left: 2px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 5px;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 100%;
  height: 100%;
  min-height: 100%;
  overflow-y: fixed;
}
.table-in {
  height: 100%;
  max-height: 100%;
}
#change {
  width: 100%;
  height: 10%;
}
.el-pagination {
  margin-top: 10px;
  float: right;
}
</style>
