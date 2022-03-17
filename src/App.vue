<template>
  <router-view />
</template>

<script>
import * as echarts from "echarts";
import axios from "axios";
import { provide } from "vue";
export default {
  setup() {
      //全局使用echarts,axios
      provide("echarts",echarts);
      provide("axios",axios);
  },
};
</script>

<style>
@import "./assets/css/main.css";
@import "./assets/css/color-dark.css";
</style>
