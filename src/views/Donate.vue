<template>
  <scoll-example class="website" />
</template>

<script>
import ScollExample from "../components/ScollExample.vue"
export default {
  components: { ScollExample},

  setup() {},
};
</script>

<style>
.website {
  height: 110%;
  border-radius: 5px;
  /* background-color: #020f2e; */
  margin: 6px;
  width: 100%;
  border: 1px solid;
  border-color: white;
}
</style>