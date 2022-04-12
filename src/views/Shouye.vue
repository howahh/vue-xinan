<template>
  <div class="all">
    <el-row :gutter="10">
      <!-- 左侧两个 -->
      <el-col :span="6">
        <!-- 系统运行状态 -->
        <LineChart myid="test1" mytype='line' />
        <Circle myid="test2" />
      </el-col>
      <!-- 地图 -->
      <el-col :span="12">
        <Map />
      </el-col>
      <!-- 右边两列 -->
      <el-col :span="6">
        <Pie myid="test3" />
        <Lines myid="test4" />
      </el-col>
      <!-- 下面的一行 -->
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <LineChart myid="test5" mytype="bar" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import LineChart from "../components/LineChart.vue";
import Map from "../components/WorldMap.vue";
import Pie from "../components/Pie.vue";
import Circle from "../components/Circle.vue";
import Lines from "../components/Lines.vue";

export default {
  name: "shouye",
  components: {
    LineChart,
    Map,
    Pie,
    Circle,
    Lines,
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
.all {
  background-image: url("../assets/img/3.gif");
  background-size: 100% 100%;
}
</style>
