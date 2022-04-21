<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i> 爬虫管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>爬虫任务添加</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-row :gutter="20">
      <el-col :span="12">
        <add-spider />
      </el-col>
      <el-col :span="12">
        <img src="../assets/img/spider.png" alt="">
      </el-col>
    </el-row>
  </div>
</template>

<script>
import AddSpider from "../components/AddSpider.vue";

export default {
  name: "SpiderAdd",
  components: {
    AddSpider,
  },
  setup() {},
};
</script>

<style>
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 400px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>