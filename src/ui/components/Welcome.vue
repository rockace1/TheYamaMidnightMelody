<template>
  <div class="main-container">
    <el-row class="file">
      <el-form :inline="true">
        <el-form-item label="文件路径">
          <el-input placeholder="请选择要转换的文件" :value="tempFile" style="width:500px" readonly></el-input>
        </el-form-item>
        <el-form-item>
          <input
            id="fileSelector"
            ref="fileSelector"
            type="file"
            accept="text/plain"
            @change="selectFile($event)"
          />
          <el-button type="primary" @click="toSelectFile()">选择</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="add2Array()">添加到队列</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="list">
      <el-table :data="tableData" style="width: 100%" :row-style="rowStyleName">
        <el-table-column label="序号" width="100">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="source" label="源文件名"></el-table-column>
        <el-table-column prop="dest" label="目标文件名"></el-table-column>
        <el-table-column label="是否完成" width="100">
          <template slot-scope="scope">
            <div v-if="running">
              <i class="el-icon-loading check-loading" />
            </div>
            <div v-else>
              <i v-if="scope.row.finished" class="el-icon-circle-check check-success" />
              <i v-else class="el-icon-video-pause check-loading" />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row class="footer">
      <span>File:D:\Documents\家乡荣耀地点词典.xlsx</span>
    </el-row>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import path from "path";
import moment from "moment";

export default Vue.extend({
  data() {
    let result: {
      tableData: Array<{ source: string; dest: string; finished: boolean }>;
      tempFile: string | null;
      running: boolean;
    } = {
      tableData: [],
      tempFile: null,
      running: false
    };
    return result;
  },
  methods: {
    toSelectFile(): void {
      let inputObj: any = this.$refs["fileSelector"];
      if (inputObj) {
        inputObj.click();
      } else {
        console.log("where input?");
      }
    },
    selectFile(event: any): void {
      let inputObj = event.currentTarget;
      if (inputObj) {
        let file: string = inputObj.value;
        console.log(file);
        this.tempFile = file;
      } else {
        console.log("where input?");
      }
    },
    add2Array(): void {
      if (this.tempFile != null) {
        let name: string = this.tempFile;
        let data: { source: string; dest: string; finished: boolean } = {
          source: name,
          dest: this.getFileName(name),
          finished: false
        };
        this.tableData.push(data);
      }
      this.tempFile = null;
    },
    getFileName(name: string): string {
      let now = moment().format("YYYYMMDDHHmmss");
      let index = name.lastIndexOf("\\");
      let dirName = name.substring(0, index);
      let fileName = name.substring(index + 1).replace(path.extname(name), "");
      let ext = ".xlsx";
      let result = dirName + "\\" + fileName + "-" + now + ext;
      return result;
    },
    rowStyleName({
      row,
      rowIndex
    }: {
      row: { source: string; dest: string; finished: boolean };
      rowIndex: number;
    }): object | null {
      if (row.finished) {
        return { background: "#e4f8cf" };
      }
      return null;
    }
  },
  mounted: function() {
    let table: Array<{ source: string; dest: string; finished: boolean }> = [
      {
        source: "D:/Documents/家乡荣耀地点词典.txt",
        dest: "D:/Documents/家乡荣耀地点词典.xlsx",
        finished: false
      },
      {
        source: "D:/Documents/家乡荣耀地点词典1.txt",
        dest: "D:/Documents/家乡荣耀地点词典2.xlsx",
        finished: true
      }
    ];
    for (let t of table) {
      this.tableData.push(t);
    }
  }
});
</script>

<style scoped>
.file {
  position: absolute;
  padding-top: 20px;
  width: 100%;
  background-color: #f4f6f8;
  height: 80px;
  top: 0px;
}
.list {
  position: absolute;
  top: 100px;
  width: calc(100% - 50px);
  padding-left: 50px;
}
.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 60px;
  background-color: #545c64;
  padding-left: 45px;
}
.check-success {
  color: #2b8630;
  font-size: 18px;
}
.check-loading {
  font-size: 18px;
}
#fileSelector {
  visibility: hidden;
  position: absolute;
}
</style>

