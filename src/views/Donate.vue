<template>
  <scoll-example class="website" />
</template>

<script>
import ScollWebsite from "../components/ScollWebsite.vue";
import ScollExample from "../components/ScollExample.vue"
export default {
  components: { ScollWebsite, ScollExample},

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