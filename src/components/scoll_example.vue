<template>
  <div class="marquee-wrap">
    <ul class="marquee-list" :class="{ 'animate-up': animateUp }">
      <li v-for="(item, index) in listData" :key="index">{{ item }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "marquee-up",
  data() {
    return {
      animateUp: false,
      listData: [
        "111111111111111111111111",
        "222222222222222222222",
        "333333333333333333333333",
        "4444444444444444444444444"
      ],
      timer: null,
    };
  },
  mounted() {
    this.timer = setInterval(this.scrollAnimate, 1500);
  },
  methods: {
    scrollAnimate() {
      this.animateUp = true;
      setTimeout(() => {
        this.listData.push(this.listData[0]);
        this.listData.shift();
        this.animateUp = false;
      }, 500);
    },
  },
  destroyed() {
    clearInterval(this.timer);
  },
};
</script>

<style lang="scss" scoped>
.marquee-wrap {
  height: 60px;
  background: rgba($color: #000000, $alpha: 0.6);
  overflow: hidden;
  .marquee-list {
    li {
      line-height: 20px;
      text-align: center;
      color: #fff;
    }
  }
  .animate-up {
    transition: all 0.5s ease-in-out;
    transform: translateY(-20px);
  }
}
</style>