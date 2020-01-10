<template>
    <div class="main-container">
        <el-row class="list">
            <el-table :data="tableData" :max-height="tableHeight" stripe style="width: 100%">
                <el-table-column prop="id" label="ID" width="180"></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column label="创建日期" width="180">
                    <template slot-scope="scope">
                        <span>{{ formateDate(scope.row.date) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="openUpdateForm(scope.row.id)">编辑</el-button>
                        <el-popover
                            placement="top"
                            width="160"
                            v-model="scope.row.visible"
                            :ref="scope.$index"
                        >
                            <p>这是一段内容确定删除吗？</p>
                            <div style="text-align: right; margin: 0">
                                <el-button
                                    size="mini"
                                    type="text"
                                    @click="scope.row.visible = false"
                                >取消</el-button>
                                <el-button
                                    type="primary"
                                    size="mini"
                                    @click="deleteRecord(scope.row.id,scope.row)"
                                >确定</el-button>
                            </div>
                            <el-button
                                type="text"
                                size="small"
                                slot="reference"
                                style="margin-left:8px;"
                            >删除</el-button>
                        </el-popover>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <el-row class="footer">
            <el-col :span="4">
                <el-button
                    type="primary"
                    style="float:left;margin-left:20px"
                    @click="openInsertForm()"
                >新建</el-button>
            </el-col>
            <el-col :span="20">
                <el-pagination
                    style="float:right;margin-right:20px"
                    background
                    layout="prev, pager, next"
                    :total="count"
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
                    <el-form-item label="字段分隔符" :label-width="formLabelWidth">
                        <el-input v-model="form.delimiter" autocomplete="off"></el-input>
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
                    <el-button type="primary" @click="save()">确 定</el-button>
                </div>
            </el-dialog>
        </el-row>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import moment from "moment";
import ColumnEditor from "../components/ColumnEditor.vue";
// eslint-disable-next-line no-unused-vars
import Column from "../../core/entity/Column";
// eslint-disable-next-line no-unused-vars
import Template from "../../core/entity/Template";
// eslint-disable-next-line no-unused-vars
import Page from "../../core/entity/Page";
// eslint-disable-next-line no-unused-vars
import Result from "../../core/entity/Result";
import messenger from "../router/messenger";
import TempCtrl from "../controller/TemplateController";

export default Vue.extend({
    data() {
        let result: {
            tableHeight: number;
            tableData: Template[];
            form: Template;
            visible: boolean;
            dialogFormVisible: boolean;
            formLabelWidth: string;
            count: number;
            current: number;
            updateFlag: boolean;
        } = {
            tableHeight: document.documentElement.clientHeight - 135,
            tableData: [],
            form: { columns: [] },
            visible: false,
            dialogFormVisible: false,
            formLabelWidth: "120px",
            count: 0,
            current: 1,
            updateFlag: false
        };
        return result;
    },
    methods: {
        openInsertForm(): void {
            this.clearForm();
            this.dialogFormVisible = true;
            this.updateFlag = false;
        },
        save(): void {
            if (!this.templateValidator(this.updateFlag)) {
                return;
            }
            let func: Function = TempCtrl.create;
            let errMsg: string = "新增模板异常";
            if (this.updateFlag) {
                func = TempCtrl.update;
                errMsg = "更新模板[" + this.form.id + "]异常";
            }
            func(this.form).then((result: Result<void>) => {
                if (result.success) {
                    this.clearForm();
                    this.dialogFormVisible = false;
                    this.query(this.current);
                    messenger.$emit("flushTemplate");
                } else {
                    messenger.$error(errMsg, this);
                }
            });
        },
        openUpdateForm(id: number): void {
            this.clearForm();
            this.dialogFormVisible = true;
            this.updateFlag = true;
            TempCtrl.find(id).then((result: Result<Template>) => {
                if (!result.success || this.isEmpty(result.data)) {
                    messenger.$error("查询模板信息异常", this);
                } else {
                    let data: Template = result.data!;
                    let columns: Column[] = [];
                    for (let i = 0; i < data.columns.length; i++) {
                        let c: Column = data.columns[i];
                        columns.push({
                            name: c.name,
                            type: c.type,
                            tempId: c.tempId
                        });
                    }
                    this.form = {
                        columns: columns,
                        name: data.name,
                        delimiter: data.delimiter,
                        id: data.id,
                        date: data.date
                    };
                }
            });
        },
        deleteRecord(id: number, row: any): void {
            TempCtrl.destroy(id).then((result: Result<void>) => {
                if (result.success) {
                    this.query(this.current);
                    row.visible = false;
                    messenger.$emit("flushTemplate");
                } else {
                    messenger.$error("删除模板异常", this);
                }
            });
        },
        query(page: number): void {
            TempCtrl.query(page).then((result: Result<Page<Template>>) => {
                if (result.success) {
                    this.tableData = [];
                    for (let t of result.data!.getData()) {
                        this.tableData.push(t);
                    }
                    this.count = result.data!.getCount();
                } else {
                    messenger.$error("查询模板异常", this);
                }
            });
        },
        change(index: number, col: Column): void {
            this.form.columns[index] = col;
        },
        addColumn(index: number): void {
            let empty: Column = { type: 0 };
            let length: number = this.form.columns.length;
            let next: number = index + 1;
            let left: Array<Column> = this.form.columns.slice(0, next);
            let right: Array<Column> = this.form.columns.slice(next, length);
            this.form.columns = left.concat(empty, right);
        },
        delColumn(index: number): void {
            if (this.form.columns.length > 1) {
                this.form.columns.splice(index, 1);
            }
        },
        clearForm(): void {
            let empty: Column[] = [{ type: 0 }];
            this.form = { columns: empty };
        },
        templateValidator(checkId: boolean): boolean {
            let data: Template = this.form;
            if (checkId && this.isEmpty(data.id)) {
                messenger.$warning("ID不能为空", this);
                return false;
            }
            if (this.isEmpty(data.name)) {
                messenger.$warning("模板名称不能为空", this);
                return false;
            }
            if (this.isEmpty(data.columns) || data.columns.length < 1) {
                messenger.$warning("列定义不能为空", this);
                return false;
            }
            if (this.isEmpty(data.delimiter)) {
                messenger.$warning("模板分隔符不能为空", this);
                return false;
            }
            return true;
        },
        isEmpty(value: any): boolean {
            return value === null || value === undefined || value === "";
        },
        formateDate(date: Date): string {
            return moment(date).format("YYYY-MM-DD HH:mm:ss");
        }
    },
    mounted: function() {
        let v = this;
        v.query(v.current);
        window.addEventListener("resize", () => {
            setTimeout(() => {
                let newHeight: number =
                    document.documentElement.clientHeight - 135;
                if (v.tableHeight === newHeight) {
                    return;
                }
                v.tableHeight = newHeight;
            }, 500);
        });
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