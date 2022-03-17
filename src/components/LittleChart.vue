<template>
  <div clss="things">
    <slot></slot>
  </div>
</template>

<script>
export default {
}
</script>

<style  lang="less">
.things {
  height: 240px ;
  border: 1px solid blue;
  margin: 8px;
  background-color:rgba(12,130,255,.85);
}
</style>