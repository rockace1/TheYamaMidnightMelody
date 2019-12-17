<template>
  <el-row>
    <el-col :span="10" style="margin:5px;">
      <el-form-item :label="'第'+(i+1)+'列'" label-width="120px">
        <el-input autocomplete="off" placeholder="表头名" v-model="col.name" @change="change(i,col)"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="8" style="margin:5px;">
      <el-select v-model="col.type" placeholder="列类型" @change="change(i,col)">
        <template v-for="(type,j) in colType">
          <el-option :key="j" :label="type.name" :value="type.value"></el-option>
        </template>
      </el-select>
    </el-col>
    <el-col :span="4" style="margin:15px 0px 0px 0px;">
      <i class="el-icon-circle-plus icon" style="margin-right:5px;color:#2b8630" @click="add(i)"></i>
      <i class="el-icon-remove icon" style="margin-left:5px;color:#ff4a4a" @click="del(i)"></i>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    i: Number,
    col: Object
  },
  methods: {
    change(index: number, col: { name: string; type: number }): void {
      console.log("click-change=", index);
      this.$emit("change", index, col);
    },
    add(index: number): void {
      this.$emit("add", index);
    },
    del(index: number): void {
      this.$emit("del", index);
    }
  },
  data() {
    const colType: Array<{ name: string; value: number }> = [
      {
        name: "常规",
        value: 0
      },
      {
        name: "数值",
        value: 1
      },
      {
        name: "货币",
        value: 2
      },
      {
        name: "会计专用",
        value: 3
      },
      {
        name: "日期",
        value: 4
      },
      {
        name: "时间",
        value: 5
      },
      {
        name: "百分比",
        value: 6
      },
      {
        name: "分数",
        value: 7
      },
      {
        name: "科学计数",
        value: 8
      },
      {
        name: "文本",
        value: 9
      }
    ];
    let result: any = {
      colType: colType
    };
    return result;
  }
});
</script>
<style scoped>
.icon {
  cursor: pointer;
  font-size: 18px;
}
</style>