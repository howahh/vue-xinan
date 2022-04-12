<template>
  <!-- <card-component ref="cardTemplate"> </card-component> -->

  <!-- <el-row><Card /></el-row> -->
  <el-row></el-row>
  <el-row :gutter="20">
    <!-- <el-col :span="12"> </el-col> -->
    <el-col :span="6">
      <card-icon
        arr="grid-con-1"
        myclass="el-icon-user-solid"
        name="2200"
        desc="网站检测数量"
      />
    </el-col>

    <el-col :span="6">
      <card-icon
        arr="grid-con-3"
        myclass="el-icon-s-goods"
        name="4396"
        desc="新增侵权网站数量"
      />
    </el-col>

    <el-col :span="6">
      <card-icon
        arr="grid-con-2"
        myclass="el-icon-message-solid"
        name="777"
        desc="侵权电影数量"
      />
    </el-col>

    <el-col :span="6">
      <card-icon
        arr="grid-con-2"
        myclass="el-icon-lx-tag"
        name="777"
        desc="侵权电影数量"
      />
    </el-col>
  </el-row>

  <el-row></el-row>
  <el-row></el-row>

  <el-row :gutter="20">
    <el-col :span="2" class="card-view">
      <!-- <div class="grid-content1 bg-purple" /> -->
    </el-col>
    <el-col :span="9">
      <!-- <div class="grid-content1 bg-purple" /> -->
      <card-view class="card-view" />
    </el-col>
    <el-col :span="2"></el-col>
    <el-col :span="9">
      <!-- <div class="grid-content1 bg-purple" /> -->
      <card-view class="card-view" />
    </el-col>
    <el-col :span="2">
      <!-- <div class="grid-content1 bg-purple" /> -->
    </el-col>
  </el-row>

  <el-row>
    <el-col>
      
    </el-col>
  </el-row>

</template>


<script>
import CardIcon from "../components/CardIcon.vue";
import CardView from "../components/CardView.vue";

export default {
  name: "mytables",
  components: {
    CardIcon,
    CardView,
  },
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

.mgb20 {
  margin-bottom: 20px;
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
  min-height: 100px;
  display: flex;
  align-items: center;
  height: 100px;
}
.grid-content1 {
  border-radius: 4px;
  min-height: 800px;
}

.card-view {
  border-radius: 4px;
  height: 200%;
  /* background-color: #222; */
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.el-row {
  margin-bottom: 20px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-avator {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}

.schart {
  width: 100%;
  height: 300px;
}

* {
  margin: 0;
  padding: 0;
}
#box {
  width: 300px;
  height: 32px;
  overflow: hidden;
  padding-left: 30px;
  border: 1px solid black;
}
.anim {
  transition: all 0.5s;
  margin-top: -30px;
}
#con1 li {
  list-style: none;
  line-height: 30px;
  height: 30px;
}
</style>