<template>
  <scoll-website class="website" />
</template>

<script>
import ScollWebsite from "../components/ScollWebsite.vue";
export default {
  components: { ScollWebsite },

  setup() {},
};
</script>

<style>
.website {
  height: 500px;
  border-radius: 5px;
  /* background-color: #020f2e; */
  margin: 6px;
  width: 100%;
  border: 1px solid;
  border-color: white;
}
</style>