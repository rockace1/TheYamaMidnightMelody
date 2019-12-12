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
            <el-menu-item index="1">文件转换</el-menu-item>
            <el-menu-item index="2">模板管理</el-menu-item>
          </el-menu>
        </el-header>
        <el-main>
          <router-view />
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
    return {
      activeIndex: "1",
      path: {
        "1": { path: "/" },
        "2": { path: "/about" }
      }
    };
  },
  methods: {
    handleSelect(key: string): void {
      let dest: any = this.path[key];
      console.log(dest);
      this.$router.push(dest);
    }
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
