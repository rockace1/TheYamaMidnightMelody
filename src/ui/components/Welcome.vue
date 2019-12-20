<template>
  <div class="main-container">
    <el-row class="file">
      <el-form :inline="true">
        <el-form-item label="文件路径">
          <el-input
            placeholder="请选择要转换的文件"
            :value="tempFile==null?'':tempFile.path"
            style="min-width:350px"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item>
          <input
            id="fileSelector"
            ref="fileSelector"
            type="file"
            accept="text/plain"
            @change="selectFile($event)"
          />
          <el-button plain @click="toSelectFile()" :disabled="running">选择文件</el-button>
        </el-form-item>
        <el-select v-model="tempFile.id" placeholder="选择模板" @change="selectTemplate">
          <template v-for="(template,j) in templateData">
            <el-option :key="j" :label="template.name" :value="template.id"></el-option>
          </template>
        </el-select>
        <el-form-item style="margin-left:10px">
          <el-button type="primary" @click="add2Array()" :disabled="running">添加到队列</el-button>
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
        <el-table-column prop="tempId" label="适用模板" width="100"></el-table-column>
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
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <div v-if="running">
              <i class="el-icon-error" style="font-size: 18px;" />
            </div>
            <div v-else>
              <i
                v-if="scope.row.finished"
                class="el-icon-error"
                style="cursor: not-allowed;font-size: 18px;"
              />
              <i
                v-else
                class="el-icon-error"
                @click="del(scope.$index)"
                style="color:#ff4a4a;cursor: pointer;font-size: 18px;"
              />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row class="footer">
      <el-col :span="20" align="left" style="margin:20px 0 0 45px">
        <span style="color:#FFFFFF">File:D:\Documents\家乡荣耀地点词典.xlsx</span>
      </el-col>
      <el-col :span="2" style="margin-top:12px">
        <el-button type="success" @click="run()" :disabled="running">开始</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import path from "path";
import moment from "moment";
// eslint-disable-next-line no-unused-vars
import { TempFile, Transfer } from "../model/Model";
// eslint-disable-next-line no-unused-vars
import Template from "../../core/entity/Template";
import { TemplateRecordArray, TransferArray } from "../model/Data";

export default Vue.extend({
  data() {
    let result: {
      tableData: Array<Transfer>;
      templateData: Array<Template>;
      tempFile: TempFile;
      running: boolean;
    } = {
      tableData: [],
      templateData: [],
      tempFile: { id: null, path: null },
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
        if (this.tempFile == null) {
          this.tempFile = { id: null, path: file };
        }
        this.tempFile.path = file;
      } else {
        console.log("where input?");
      }
    },
    selectTemplate(id: number): void {
      if (id) {
        let templateId: number = id;
        console.log(templateId);
        if (this.tempFile == null) {
          this.tempFile = { id: templateId, path: null };
        }
        this.tempFile.id = templateId;
      } else {
        console.log("where select?");
      }
    },
    add2Array(): void {
      if (this.tempFile == null) {
        console.log("tempFile is null");
        return;
      }
      if (this.tempFile.id == null) {
        console.log("temp id is null");
        return;
      }
      if (this.tempFile.path == null) {
        console.log("file is null");
        return;
      }
      let filePath: string = this.tempFile.path;
      let data: Transfer = {
        source: filePath,
        dest: this.getFileName(filePath),
        finished: false,
        tempId: this.tempFile.id
      };
      this.tableData.push(data);
      this.tempFile = { id: null, path: null };
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
      row
    }: {
      row: { finished: boolean };
      rowIndex: number;
    }): object | null {
      if (row.finished) {
        return { background: "#e4f8cf" };
      }
      return null;
    },
    del(index: number): void {
      if (this.tableData.length > 1) {
        this.tableData.splice(index, 1);
      }
    },
    run(): void {
      this.running = true;
      let vue = this;
      let length = this.tableData.length;
      for (let i = 0; i < length; i++) {
        let data: Transfer = vue.tableData[i];
        setTimeout(() => {
          vue.convertOne(data, () => {
            if (vue.tableData.length == i + 1) {
              vue.running = false;
            }
          });
        }, i * 1000);
      }
    },
    convertOne(data: Transfer, callback: Function): void {
      if (data.finished) {
        callback();
        return;
      }
      setTimeout(() => {
        data.finished = true;
        callback();
      }, 1000);
    }
  },
  mounted: function() {
    for (let t of TransferArray) {
      this.tableData.push(t);
    }
    for (let t of TemplateRecordArray) {
      this.templateData.push(t);
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
  padding: 0;
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

