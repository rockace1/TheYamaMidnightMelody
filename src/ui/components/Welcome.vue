<template>
    <div
        class="main-container"
        v-loading="running"
        element-loading-text="转换中"
        element-loading-background="rgba(0,0,0,0.5)"
    >
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
                    <el-button plain @click="selectFile()" :disabled="running">选择文件</el-button>
                </el-form-item>
                <el-select v-model="tempFile.index" placeholder="选择模板" @change="selectTemplate">
                    <template v-for="(template,j) in templateData">
                        <el-option :key="j" :label="template.name" :value="j"></el-option>
                    </template>
                </el-select>
                <el-form-item style="margin-left:10px">
                    <el-button type="primary" @click="add2Queue()" :disabled="running">添加到转换区</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row class="list">
            <el-table
                :data="tableData"
                style="width: 100%"
                :max-height="tableHeight"
                :row-style="rowStyleName"
            >
                <el-table-column label="序号" width="100">
                    <template slot-scope="scope">{{ scope.$index + 1 }}</template>
                </el-table-column>
                <el-table-column prop="source" label="源文件名"></el-table-column>
                <el-table-column prop="dest" label="目标文件名"></el-table-column>
                <el-table-column prop="tempName" label="适用模板" width="100"></el-table-column>
                <el-table-column label="是否完成" width="100">
                    <template slot-scope="scope">
                        <i v-if="scope.row.finished" class="el-icon-circle-check check-success" />
                        <i v-else-if="running" class="el-icon-loading check-loading" />
                        <i v-else class="el-icon-video-pause check-loading" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                        <i
                            v-if="scope.row.finished||running"
                            class="el-icon-error"
                            style="cursor: not-allowed;font-size: 18px;"
                        />
                        <i
                            v-else
                            class="el-icon-error"
                            @click="del(scope.$index)"
                            style="color:#ff4a4a;cursor: pointer;font-size: 18px;"
                        />
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <el-row class="footer">
            <el-col :span="20" align="left" style="margin:20px 0 0 45px;color:#aaaaaa">
                <span v-if="runningFile">正在转换：</span>
                <span>{{ runningFile }}</span>
            </el-col>
            <el-col :span="2" style="margin-top:12px">
                <el-button type="success" @click="run()" :disabled="running">开始</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
// eslint-disable-next-line no-unused-vars
import { TempFile, Doc } from "../../core/entity/Model";
// eslint-disable-next-line no-unused-vars
import Template from "../../core/entity/Template";
// eslint-disable-next-line no-unused-vars
import Page from "../../core/entity/Page";
// eslint-disable-next-line no-unused-vars
import Result from "../../core/entity/Result";
import messenger from "../router/messenger";
import TempCtrl from "../controller/TemplateController";
import ConvCtrl from "../controller/ConvertorController";

export default Vue.extend({
    data() {
        let result: {
            tableHeight: number;
            tableData: Doc[];
            runningData: Array<{ index: number; data: Doc }>;
            templateData: Template[];
            tempFile: TempFile;
            running: boolean;
            runningFile: string;
        } = {
            tableHeight: document.documentElement.clientHeight - 220,
            tableData: [],
            runningData: [],
            templateData: [],
            tempFile: { index: null, path: null },
            running: false,
            runningFile: ""
        };
        return result;
    },
    methods: {
        selectFile(): void {
            let file = ConvCtrl.chooseFile();
            if (file) {
                if (this.tempFile == null) {
                    this.tempFile = { index: null, path: null };
                }
                this.tempFile.path = file;
            }
        },
        selectTemplate(index: number): void {
            if (this.tempFile == null) {
                this.tempFile = { index: null, path: null };
            }
            this.tempFile.index = index;
        },
        add2Queue(): void {
            if (this.tempFile.path === null) {
                messenger.$warning("请选择文件", this);
                return;
            }
            if (this.tempFile.index === null) {
                messenger.$warning("请选择模板", this);
                return;
            }
            let filePath: string = this.tempFile.path;
            let temp: Template = this.templateData[this.tempFile.index];
            if (
                temp === null ||
                temp.id === undefined ||
                temp.name === undefined
            ) {
                messenger.$error("模板数据异常", this);
                return;
            }
            let data: Doc = {
                source: filePath,
                dest: ConvCtrl.getDestPath(filePath),
                finished: false,
                tempId: temp.id!,
                tempName: temp.name!
            };
            this.tableData.push(data);
            this.tempFile = { index: null, path: null };
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
            if (this.tableData.length > 0) {
                this.tableData.splice(index, 1);
            }
        },
        run(): void {
            let length = this.tableData.length;
            if (length < 1) {
                messenger.$warning("请向转换区添加文件", this);
                return;
            }
            this.runningData = [];
            for (let i = 0; i < length; i++) {
                let data: Doc = this.tableData[i];
                if (data.finished) {
                    continue;
                }
                this.runningData.push({ index: i, data: data });
            }
            if (this.runningData.length < 1) {
                messenger.$warning("请向转换区添加文件", this);
                return;
            }
            let param = this.runningData.pop()!;
            this.convertOne(param.index, param.data);
            messenger.$emit("lock");
        },
        convertOne(index: number, data: Doc): void {
            let v = this;
            v.runningFile = data.dest;
            ConvCtrl.convert(data, index, (result, index, err) => {
                if (err) {
                    messenger.$error("文件转换异常", v);
                    return;
                }
                let data: Doc = v.tableData[index];
                if (data !== undefined) {
                    if (result.success) {
                        data.finished = true;
                        messenger.$success(
                            "文件[" + data.dest + "]转换成功",
                            v
                        );
                    } else {
                        messenger.$error("文件[" + data.dest + "]转换异常", v);
                    }
                }
                if (!v.checkFinish()) {
                    let param = v.runningData.pop();
                    if (param !== undefined) {
                        v.convertOne(param.index, param.data);
                    }
                }
            });
        },
        checkFinish(): boolean {
            let rest: number = this.runningData.length;
            let finished = rest === 0;
            if (finished) {
                messenger.$emit("unlock");
            }
            return finished;
        },
        flushTemplate(): void {
            TempCtrl.all().then((result: Result<Array<Template>>) => {
                if (result.success) {
                    this.templateData = result.data!;
                } else {
                    messenger.$error("获取模板信息异常", this);
                }
            });
        }
    },
    mounted: function() {
        let v = this;
        messenger.$on("flushTemplate", () => {
            v.flushTemplate();
        });
        v.flushTemplate();
        window.addEventListener("resize", () => {
            setTimeout(() => {
                let newHeight: number =
                    document.documentElement.clientHeight - 220;
                if (v.tableHeight === newHeight) {
                    return;
                }
                v.tableHeight = newHeight;
            }, 500);
        });
    },
    created: function() {
        let v = this;
        messenger.$on("lock", () => {
            v.running = true;
        });
        messenger.$on("unlock", () => {
            v.runningFile = "";
            v.running = false;
        });
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
</style>

