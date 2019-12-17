<template>
  <div id="app">
    <el-container>
      <el-header style="padding:0">
        <el-menu
          :default-active="activeIndex"
          @select="handleSelect"
          mode="horizontal"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          style="padding-left: 45px"
        >
          <el-menu-item index="/">文件转换</el-menu-item>
          <el-menu-item index="/temp">模板管理</el-menu-item>
        </el-menu>
      </el-header>
      <el-main style="padding:0">
        <transition name="el-zoom-in-top" :duration="800">
          <router-view />
        </transition>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import router from "vue-router";
export default Vue.extend({
  data() {
    let defaultIndex: string = "/";
    let pathMap: { [index: string]: string } = {
      "/": "/",
      "/temp": "/temp"
    };
    return {
      activeIndex: defaultIndex,
      path: pathMap
    };
  },
  methods: {
    handleSelect(key: string): void {
      let dest: any = this.path[key];
      if (dest === this.$route.path) {
        this.$router.go(0);
      } else {
        this.$router.push(dest);
      }
    }
  },
  beforeUpdate: function() {
    this.activeIndex = this.$route.path;
  }
});
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.main-container {
  position: absolute;
  width: 100%;
  height: calc(100% - 60px);
  height: -webkit-calc(100% - 60px);
  height: -moz-calc(100% - 60px);
}
</style>
