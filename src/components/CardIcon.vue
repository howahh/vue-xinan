<template>
  <el-card shadow="hover" :body-style="{ padding: '0px' }">
    <div class="grid-content" :class=arr>
      <i :class=myclass class="grid-con-icon"></i>
      <div class="grid-cont-right">
        <div class="grid-num">{{myName}}</div>
        <div>{{description}}</div>
      </div>
    </div>
  </el-card>
</template>

<script>
import { reactive, readonly } from '@vue/reactivity';
export default {
  name: "CardIcon",
  props:['name', 'arr', 'myclass', 'desc'],
  setup(props) {
    let myName = reactive(props.name)
    let description = reactive(props.desc)
    return{
      myName, description
    }
  },
};
</script>

<style>
</style>