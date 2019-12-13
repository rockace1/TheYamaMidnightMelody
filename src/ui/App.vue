<template>
  <div id="app">
    <div id="nav" style="margin:0;padding:0;">
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
        <el-main>
          <transition name="el-zoom-in-top" :duration="80">
            <router-view />
          </transition>
        </el-main>
      </el-container>
    </div>
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

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
