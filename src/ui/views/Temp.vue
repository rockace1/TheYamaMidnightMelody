<template>
  <div class="main-container">
    <el-row class="list">
      <el-table :data="tableData" :max-height="tableHeight" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="180"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="date" label="日期" width="180"></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="toUpdate(scope.row.id)">编辑</el-button>
            <el-popover placement="top" width="160" v-model="scope.row.visible" :ref="scope.$index">
              <p>这是一段内容这是一段内容确定删除吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
                <el-button
                  type="primary"
                  size="mini"
                  @click="deleteRecord(scope.row.id,scope.row)"
                >确定</el-button>
              </div>
              <el-button type="text" size="small" slot="reference" style="margin-left:8px;">删除</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row class="footer">
      <el-col :span="4">
        <el-button type="primary" style="float:left;margin-left:20px" @click="toAdd()">新建</el-button>
      </el-col>
      <el-col :span="20">
        <el-pagination
          style="float:right;margin-right:20px"
          background
          layout="prev, pager, next"
          :total="total"
          @current-change="query"
        ></el-pagination>
      </el-col>
    </el-row>
    <el-row>
      <el-dialog
        title="编辑模板"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <el-form :model="form">
          <el-form-item label="模板ID" :label-width="formLabelWidth">
            <el-input v-model="form.id" autocomplete="off" disabled></el-input>
          </el-form-item>
          <el-form-item label="模板名称" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <template v-for="(col, index) in form.columns">
            <ColumnEditor
              :key="index"
              :col="col"
              :i="index"
              @change="change"
              @add="addColumn"
              @del="delColumn"
            />
          </template>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="add()">确 定</el-button>
        </div>
      </el-dialog>
    </el-row>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ColumnEditor from "../components/ColumnEditor.vue";
import { TemplateRecord, ExcelColumn } from "../model/Model";
import { TemplateRecordArray } from "../model/Data";
export default Vue.extend({
  data() {
    let result: {
      tableData: Array<TemplateRecord>;
      form: TemplateRecord;
      visible: boolean;
      dialogFormVisible: boolean;
      formLabelWidth: string;
      total: number;
    } = {
      tableData: [],
      form: {
        id: null,
        name: null,
        date: null,
        columns: []
      },
      visible: false,
      dialogFormVisible: false,
      formLabelWidth: "120px",
      total: 0
    };
    return result;
  },
  methods: {
    toAdd(): void {
      this.dialogFormVisible = true;
      this.clearForm();
    },
    add(): void {
      this.tableData.push(this.form);
      this.clearForm();
      this.dialogFormVisible = false;
    },
    toUpdate(id: number): void {
      this.dialogFormVisible = true;
      console.log("update=", id);
    },
    deleteRecord(id: number, row: any): void {
      row.visible = false;
      console.log("delete=", id);
    },
    query(page: number): void {
      console.log("query page=", page);
    },
    change(index: number, col: ExcelColumn): void {
      this.form.columns[index] = col;
    },
    addColumn(index: number): void {
      const empty = { name: null, type: 0 };
      let length: number = this.form.columns.length;
      let next: number = index + 1;
      let left: Array<ExcelColumn> = this.form.columns.slice(0, next);
      let right: Array<ExcelColumn> = this.form.columns.slice(next, length);
      this.form.columns = left.concat(empty, right);
    },
    delColumn(index: number): void {
      if (this.form.columns.length > 1) {
        this.form.columns.splice(index, 1);
      }
    },
    clearForm(): void {
      this.form = {
        id: null,
        name: null,
        date: null,
        columns: [{ name: null, type: 0 }]
      };
    }
  },
  mounted: function() {
    let table = TemplateRecordArray;
    for (let t of table) {
      this.tableData.push(t);
    }
  },
  computed: {
    tableHeight: function() {
      return document.documentElement.clientHeight - 135;
    }
  },
  components: { ColumnEditor }
});
</script>

<style scoped>
.list {
  margin: 0 0 0 20px;
  width: calc(100% - 20px);
}
.footer {
  position: absolute;
  margin-top: 10px;
  width: 100%;
  height: 60px;
  padding: 10px 0 0 45px;
}
</style>