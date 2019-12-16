<template>
  <div class="main-container">
    <el-row style="margin-bottom: 15px;">
      <el-table :data="tableData" max-height="570" stripe style="width: 100%">
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
                <el-button type="primary" size="mini" @click="toDelete(scope.row.id,scope.row)">确定</el-button>
              </div>
              <el-button type="text" size="small" slot="reference" style="margin-left:8px;">删除</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <el-col :span="4">
        <el-button type="primary" style="float:left;margin-left:20px" @click="toAdd()">新建</el-button>
      </el-col>
      <el-col :span="20">
        <el-pagination
          style="float:right;margin-right:20px"
          background
          layout="prev, pager, next"
          :total="21"
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
          <template v-for="(col, index) in form.col">
            <ColumnEditor
              :key="index"
              :col="col"
              :i="index"
              @change="change"
              @add="add"
              @del="del"
            />
          </template>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </el-row>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ColumnEditor from "../components/ColumnEditor.vue";
export default Vue.extend({
  data() {
    let result: {
      tableData: Array<{ id: number; name: string; date: string }>;
      form: {
        id: number | null;
        name: string | null;
        col: Array<{ name: string | null; type: number | null }>;
      };
      visible: boolean;
      dialogFormVisible: boolean;
      formLabelWidth: string;
    } = {
      tableData: [],
      form: {
        id: null,
        name: null,
        col: [
          {
            name: null,
            type: 0
          }
        ]
      },
      visible: false,
      dialogFormVisible: false,
      formLabelWidth: "120px"
    };
    return result;
  },
  methods: {
    toAdd(): void {
      this.dialogFormVisible = true;
      this.clearForm();
    },
    toUpdate(id: number): void {
      this.dialogFormVisible = true;
      console.log("update=", id);
    },
    toDelete(id: number, row: any): void {
      row.visible = false;
      console.log("delete=", id);
    },
    change(index: number, col: { name: string; type: number }): void {
      console.log("change=", index, ",col=", JSON.stringify(col));
    },
    add(index: number): void {
      const empty = { name: null, type: 0 };
      let length: number = this.form.col.length;
      let next: number = index + 1;
      let left: Array<any> = this.form.col.slice(0, next);
      let right: Array<any> = this.form.col.slice(next, length);
      this.form.col = left.concat(empty, right);
    },
    del(index: number): void {
      if (this.form.col.length > 1) {
        this.form.col.splice(index, 1);
      }
    },
    clearForm(): void {
      this.form = { id: null, name: null, col: [{ name: null, type: 0 }] };
    }
  },
  mounted: function() {
    let table: Array<{ id: number; name: string; date: string }> = [
      {
        id: 100,
        date: "2016-05-02",
        name: "上海市普陀区金沙江路 1518 弄"
      },
      {
        id: 101,
        date: "2016-05-04",
        name: "上海市普陀区金沙江路 1517 弄"
      },
      {
        id: 102,
        date: "2016-05-01",
        name: "上海市普陀区金沙江路 1519 弄"
      },
      {
        id: 103,
        date: "2016-05-03",
        name: "上海市普陀区金沙江路 1516 弄"
      },
      {
        id: 104,
        date: "2016-05-03",
        name: "上海市普陀区金沙江路 1515 弄"
      },
      {
        id: 105,
        date: "2016-05-03",
        name: "上海市普陀区金沙江路 1514 弄"
      },
      {
        id: 106,
        date: "2016-05-03",
        name: "上海市普陀区金沙江路 1513 弄"
      },
      {
        id: 107,
        date: "2016-05-03",
        name: "上海市普陀区金沙江路 1512 弄"
      },
      {
        id: 108,
        date: "2016-05-03",
        name: "上海市普陀区金沙江路 1511 弄"
      },
      {
        id: 109,
        date: "2016-05-03",
        name: "上海市普陀区金沙江路 1510 弄"
      }
    ];
    for (let t of table) {
      this.tableData.push(t);
    }
  },
  components: { ColumnEditor }
});
</script>
