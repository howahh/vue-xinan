<template>
  <a-row style="margin: 20px">
    <a-col style="width: 100%"
      ><div class="myTable">
        <a-table
          :dataSource="
            dataSource.slice(
              (currentPage - 1) * pageSize,
              currentPage * pageSize
            )
          "
          :columns="myColumns"
          :pagination="false"
          bordered
          :scroll="{ y: 475 }"
          :loading="loading"
        />
        <div class="tableHandel">
          <a-pagination
            showSizeChanger
            showQuickJumper
            v-model:pageSize="pageSize"
            v-model:current="currentPage"
            :pageSizeOptions="['5', '10', '20']"
            :total="dataSource.length"
            @change="changeCureentPage"
          >
          </a-pagination>
        </div>
      </div>
    </a-col>
  </a-row>
  <a-row style="margin: 20px">
    <a-col style="width: 100%">
      <div class="myForm">
        <a-form
          :model="formState"
          name="basic"
          :label-col="{ span: 2 }"
          :wrapper-col="{ span: 8 }"
          autocomplete="off"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
          style="padding-top: 10px"
        >
          <a-form-item
            label="任务名称"
            name="methodname"
            :rules="[{ required: true, message: '请输入任务名称' }]"
          >
            <a-input v-model:value="formState.methodname" />
          </a-form-item>

          <a-form-item
            label="任务类型"
            name="degree"
            :rules="[{ required: true, message: '请选择分析类型' }]"
          >
            <a-select v-model:value="formState.degree">
              <a-select-option value="快速分析">快速分析</a-select-option>
              <a-select-option value="深度分析">深度分析</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :wrapper-col="{ offset: 2, span: 2 }">
            <a-button
              type="primary"
              html-type="submit"
              v-loading.fullscreen.lock="fullscreenLoading"
              >开始分析</a-button
            >
          </a-form-item>
        </a-form>
      </div>
    </a-col>
  </a-row>
</template>

<script>
import { reactive, ref, inject, onMounted, onBeforeMount } from "vue";
import { ElNotification } from "element-plus";
import { useRouter,useRoute } from "vue-router";

export default {
  name: "AnalyzeJob",
  // props: {}
  setup() {
    const router = useRouter();
    const route = useRoute();
    let $axios = inject("axios");
    //列配置
    let columns = [
      {
        title: "姓名",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "年龄",
        dataIndex: "age",
        key: "age",
      },
      {
        title: "住址",
        dataIndex: "address",
        key: "address",
        width: "",
      },
      {
        title: "id",
        dataIndex: "key",
        key: "key",
      },
    ];
    let myColumns = [
      { title: "域名", dataIndex: "domain", key: "domain" },
      { title: "关键词", dataIndex: "keyword", key: "keword" },
      { title: "网页标题", dataIndex: "title", key: "title" },
      { title: "URL", dataIndex: "url", key: "url" },
      { title: "aliveDate", dataIndex: "aliveDate", key: "aliveDate" },
      { title: "crawledDate", dataIndex: "crawledDate", key: "crawledDate" },
    ];
    //对pagination参数进行设置
    let pageSize = ref(10);
    let currentPage = ref(1);
    let dataSource = reactive([]);
    let loading = ref(true);
    function changeCureentPage(page, newPageSize) {
      currentPage.value = page;
      pageSize.value = newPageSize;
    }
    onBeforeMount(() => {
      let name=route.query.name
      getData(name);
    });
    async function getData(name) {
      await $axios
        .post("http://localhost:5000/site/getSiteByJobDate", {
          param: name,
        })
        .then((response) => {
          console.log(response);
          for (var i in response.data.data) {
            dataSource.push(response.data.data[i]);
          }
          loading.value = false;
          console.log(dataSource);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    const formState = reactive({
      methodname: "",
      degree: "",
    });

    const onFinish = (values) => {
      console.log("Success:", values);
      var param = values.degree + "-" + values.methodname;
      $axios
        .post("http://localhost:5000/apiRequestSender/query/setTimer", {
          name: param,
          second: "300",
        })
        .then((response) => {
          console.log(response);
          openFullScreen1();
        });
    };

    const onFinishFailed = (errorInfo) => {
      console.log("Failed:", errorInfo);
    };
    let fullscreenLoading = ref(false);
    function openFullScreen1() {
      fullscreenLoading.value = true;
      setTimeout(() => {
        fullscreenLoading.value = false;
        message();
        router.push("/eventstatus");
      }, 1000);
    }

    const message = () => {
      ElNotification({
        title: "提交任务成功",
        message: "您已经成功提交了一个爬取任务",
        type: "success",
      });
    };

    return {
      dataSource,
      columns,
      pageSize,
      currentPage,
      changeCureentPage,
      getData,
      myColumns,
      loading,
      formState,
      onFinish,
      onFinishFailed,
      openFullScreen1,
      message,
      fullscreenLoading,
      router,
      route,
    };
  },
};
</script>

<style scoped>
.tableHandel {
  padding: 8px;
}
.myTable {
  background-color: white;
}
.myForm {
  background-color: white;
}
</style>
