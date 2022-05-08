<template>
  <a-card style="margin: 20px; border-radius: 20px"
  :hoverable="true">
    <a-form
      :model="formState"
      name="validate_other"
      v-bind="formItemLayout"
      @finishFailed="onFinishFailed"
      @finish="onFinish"
    >
      <a-form-item
        name="selectServer"
        label="服务器"
        has-feedback
        :rules="[{ required: true, message: 'Please select your server!' }]"
      >
        <a-select
          v-model:value="formState.selectServer"
          placeholder="Select a server"
        >
          <a-select-option value="localhost:6800"
            >localhost:6800</a-select-option
          >
        </a-select>
      </a-form-item>

      <a-form-item
        name="project"
        label="项目"
        has-feedback
        :rules="[{ required: true, message: 'Please select your project!' }]"
      >
        <a-select
          v-model:value="formState.project"
          placeholder="Select a project"
          @change="getVersion(), getSpider()"
        >
          <a-select-option value="movieCrawler">movieCrawler</a-select-option>
          <a-select-option value="siteCrawler">siteCrawler</a-select-option>
          <a-select-option value="splashHtmlCrawler"
            >splashHtmlCrawler</a-select-option
          >
        </a-select>
      </a-form-item>

      <a-form-item
        name="_version"
        label="项目版本"
        has-feedback
        :rules="[{ required: true, message: 'Please select your version!' }]"
      >
        <a-select
          v-model:value="formState._version"
          placeholder="Select a version"
        >
          <a-select-option
            v-for="version in versionInfo"
            :key="version"
            :value="version"
            >{{ version }}</a-select-option
          >
        </a-select>
      </a-form-item>

      <a-form-item
        name="spider"
        label="爬虫"
        has-feedback
        :rules="[{ required: true, message: 'Please select your spider!' }]"
      >
        <a-select
          v-model:value="formState.spider"
          placeholder="Select a spider"
          clearable
        >
          <a-select-option
            v-for="spider in spiderInfo"
            :key="spider"
            :value="spider"
            >{{ spider }}</a-select-option
          >
        </a-select>
      </a-form-item>

      <a-form-item name="switch" label="定时任务">
        <a-switch v-model:checked="formState.switch" />
      </a-form-item>

      <a-form-item
        v-show="formState.switch"
        name="action"
        label="方式"
        has-feedback
      >
        <a-select
          v-model:value="formState.action"
          placeholder="Select an action"
        >
          <a-select-option value="add">添加任务</a-select-option>
          <a-select-option value="add_fire">添加任务并立即执行</a-select-option>
          <a-select-option value="add_pause">添加任务并暂停</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item name="name" label="任务名称" v-show="formState.switch">
        <a-input
          v-model:value="formState.name"
          placeholder="textual description of the task(optional)"
        />
      </a-form-item>
      <a-form-item label="运行天数" v-show="formState.switch">
        <a-input
          v-model:value="formState.day"
          placeholder="day (1-31); CAN BE 1st mon OR last sun OF THE MONTH"
        />
      </a-form-item>

      <a-form-item
        name="day_of_Week"
        label="每周运行天数"
        v-show="formState.switch"
      >
        <a-checkbox-group v-model:value="formState['checkbox-group']">
          <a-row>
            <a-col :span="8">
              <a-checkbox value="*" style="line-height: 32px">*</a-checkbox>
            </a-col>
            <a-col :span="8">
              <a-checkbox value="mon-fri" style="line-height: 32px"
                >周一至周五</a-checkbox
              >
            </a-col>
            <a-col :span="8">
              <a-checkbox value="mon" style="line-height: 32px"
                >周一</a-checkbox
              >
            </a-col>
            <a-col :span="8">
              <a-checkbox value="tue" style="line-height: 32px"
                >周二</a-checkbox
              >
            </a-col>
            <a-col :span="8">
              <a-checkbox value="wed" style="line-height: 32px"
                >周三</a-checkbox
              >
            </a-col>
            <a-col :span="8">
              <a-checkbox value="thu" style="line-height: 32px"
                >周四</a-checkbox
              >
            </a-col>
            <a-col :span="8">
              <a-checkbox value="fri" style="line-height: 32px"
                >周五</a-checkbox
              >
            </a-col>
            <a-col :span="8">
              <a-checkbox value="sat" style="line-height: 32px"
                >周六</a-checkbox
              >
            </a-col>
            <a-col :span="8">
              <a-checkbox value="sun" style="line-height: 32px"
                >周日</a-checkbox
              >
            </a-col>
          </a-row>
        </a-checkbox-group>
      </a-form-item>

      <a-form-item name="hour" label="小时数" v-show="formState.switch">
        <a-input
          v-model:value="formState.hour"
          placeholder="hour (0-23); 9,17,8-20/4 equals to 8,9,12,16,17,20"
        />
      </a-form-item>
      <a-form-item name="minute" label="分钟数" v-show="formState.switch">
        <a-input
          v-model:value="formState.minute"
          placeholder="minute (0-59); defaults to 0, type */10 to fire every 10 minutes"
        />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 12, offset: 6 }">
        <a-button
          type="primary"
          v-loading.fullscreen.lock="fullscreenLoading"
          html-type="submit"
          >提交</a-button
        >
      </a-form-item>
    </a-form>
  </a-card>
</template>


<script>
import { defineComponent, reactive } from "vue";
import { ElNotification } from "element-plus";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons-vue";
import { inject } from "vue";
import { ref } from "vue";
import { ElLoading } from "element-plus";
import { useRouter } from "vue-router";
export default {
  name: "AddSpider",
  components: {
    UploadOutlined,
    InboxOutlined,
  },
  setup() {
    let $axios = inject("axios");
    var data_post = reactive({});
    const route = useRouter();
    const onFinishFailed = (errorInfo) => {
      console.log("Failed:", errorInfo);
    };
    var versionInfo = reactive([]);
    let spiderData = reactive({});
    var getData = reactive({});
    var spiderInfo = reactive([]);
    var flag = reactive(true);

    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 14,
      },
    };
    const formState = reactive({
      // "checkbox-group": ["*"],
      switch: false,
      rate: 3.5,
    });

    var day_of_week = reactive("");

    const fullscreenLoading = ref(false);
    var filename = reactive("");
    function openFullScreen1() {
      fullscreenLoading.value = true;
      setTimeout(() => {
        fullscreenLoading.value = false;
        message();
        route.push("/EventHandler");
      }, 5000);
    }

    const message = () => {
      ElNotification({
        title: "提交任务成功",
        message: "您已经成功提交了一个爬取任务",
        type: "success",
      });
    };

    async function run_spider(filename) {
      await $axios
        .post(
          "http://localhost:5000/apiRequestSender/query/runSpider",
          {
            filename: filename,
          },
          {
            headers: {
              "Content-Type": "application/json;charset=utf-8",
            },
            withCredentials: true,
          }
        )
        .then(function (response) {
          // console.log(response.data);
        })
        .catch(function (error) {
          console.log(error);
          console.log("bad");
        });
    }

    async function check(values) {
      await $axios
        .post(
          "http://localhost:5000/apiRequestSender/query/checkSpider",
          {
            ...values,
          },
          {
            headers: {
              "Content-Type": "application/json;charset=utf-8",
            },
            withCredentials: true,
          }
        )
        .then(function (response) {
          // console.log(response);
          filename = response.data.filename;
          run_spider(filename);
        })
        .catch(function (error) {
          console.log(error);
          console.log("bad");
        });
    }

    const onFinish = (values) => {
      if (formState["checkbox-group"] === undefined) {
        day_of_week = undefined;
      } else {
        for (var i = 0; i < formState["checkbox-group"].length; i++) {
          if (i == 0) {
            day_of_week = formState["checkbox-group"][i];
          } else {
            day_of_week = day_of_week + "," + formState["checkbox-group"][i];
          }
        }
      }

      if (formState.switch == true) {
        data_post = {
          project: formState.project,
          version: "default: the latest version",
          spider: formState.spider,
          action: formState.action,
          task_id: "0",
          trigger: "cron",
          name: formState.name,
          day: formState.day,
          week: formState.week,
          day_of_week: day_of_week,
          hour: formState.hour,
          minute: formState.minute,
          second: "0",
          start_date: "",
          end_date: "",
          timezone: "Asia/Shanghai",
          jitter: "0",
          misfire_grace_time: "600",
          coalesce: "True",
          max_instances: "1",
        };
      } else {
        data_post = {
          project: formState.project,
          version: "default: the latest version",
          spider: formState.spider,
        };
      }

      console.log(data_post);
      check(data_post);
      openFullScreen1();
    };

    //axios获取数据
    async function getVersionResponse(project) {
      await $axios
        .post(
          "http://localhost:5000/apiRequestSender/query/listVersions",
          {
            param: project,
          },
          {
            headers: {
              "Content-Type": "application/json;charset=utf-8",
            },
            withCredentials: true,
          }
        )
        .then(function (response) {
          getData = response;
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    function getVersion() {
      var response = getVersionResponse(formState.project).then(() => {
        for (var i = 0; i < getData.data.versions.length; i++) {
          versionInfo.push(getData.data.versions[i]);
        }
        versionInfo = [];
      });
    }

    async function getSpiderResponse(spider) {
      await $axios
        .post(
          "http://localhost:5000/apiRequestSender/query/listSpiders",
          {
            param: spider,
          },
          {
            headers: {
              "Content-Type": "application/json;charset=utf-8",
            },
            withCredentials: true,
          }
        )
        .then(function (response) {
          spiderData = response;
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    function getSpider() {
      var response = getSpiderResponse(formState.project).then(() => {
        for (var i = 0; i < spiderData.data.spiders.length; i++) {
          spiderInfo.pop();
        }
        flag = false;
        formState.spider = [];
        for (var i = 0; i < spiderData.data.spiders.length; i++) {
          spiderInfo.push(spiderData.data.spiders[i]);
        }
      });
    }

    return {
      formState,
      onFinish,
      onFinishFailed,
      formItemLayout,
      getVersion,
      getData,
      versionInfo,
      getSpider,
      spiderInfo,
      flag,
      check,
      message,
      openFullScreen1,
      ref,
      fullscreenLoading,
      route,
    };
  },
};
</script>