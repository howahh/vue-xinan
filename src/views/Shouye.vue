<template >
  <!-- <button @click="update">aaa</button> -->
  <div class="all">
    <el-row :gutter="4">
      <!-- 左侧两个 -->
      <el-col :span="6">
        <!-- 系统运行状态 -->
        <LittleChart />
        <LittleChart />
      </el-col>
      <!-- 地图 -->
      <el-col :span="12">
        <Map/>
      </el-col>
      <!-- 右边两列 -->
      <el-col :span="6">
        <div class="little-holder"/>
        <div class="little-holder"/>
      </el-col>
      <!-- 下面的一行 -->
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card shadow="hover" style="height: 220px"> </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import LittleChart from "../components/LittleChart.vue";
import Map from "../components/map.vue";
export default {
  name: "shouye",
  components: {
    LittleChart,
    Map,
  },
};
</script>

<style scoped lang="css">
.el-row {
  margin: 2px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 0px;
  margin: 0px;
}
.el-card {
  padding: 0px;
  margin: 5px;
  /* margin-bottom: 10px;  */
  background-color: #0d265e;
  /* width:auto; */
}
.el-card /deep/ .el-card__body {
  padding: 0px;
}
.little-holder{
  height: 224px;
  border-radius: 5px;
  background-color: #0d265e;
  margin: 6px;
  width: 100%;
  margin-right: 6px;
}
.map-holder{
   height: 453px;
  border-radius: 5px;
  background-color: #0d265e;
  margin: 6px;
  width: 100%;
}
</style>