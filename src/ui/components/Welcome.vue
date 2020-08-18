<template>
    <div
        class="main-container"
        v-loading="running"
        element-loading-text="转换中"
        element-loading-background="rgba(0,0,0,0.5)"
    >
        <el-row class="file">
            <el-col :span="4" style="margin-left:15px">
                <el-button plain @click="selectFile()" :disabled="running">选择文件</el-button>
            </el-col>
            <el-col :span="16" style="margin-top:10px;color:#aaaaaa;" align="left">
                <div class="running" v-if="runningFile">正在转换：{{ runningFile }}</div>
            </el-col>
            <el-col :span="2">
                <el-button type="success" @click="run()" :disabled="running">开始</el-button>
            </el-col>
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
                <el-table-column prop="source" label="源文件名" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="dest" label="目标文件名" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="适用模板" width="180">
                    <template slot-scope="scope">
                        <el-select
                            v-model="scope.row.tempIndex"
                            v-if="scope.row.finished||running"
                            disabled
                        >
                            <el-option
                                :key="scope.row.tempIndex"
                                :label="scope.row.tempName"
                                :value="scope.row.tempIndex"
                            ></el-option>
                        </el-select>
                        <el-select
                            v-model="scope.row.tempIndex"
                            v-else
                            placeholder="选择模板"
                            @change="selectTemplate(scope.row.tempIndex,scope.$index)"
                        >
                            <template v-for="(template,j) in templateData">
                                <el-option :key="j" :label="template.name" :value="j"></el-option>
                            </template>
                        </el-select>
                    </template>
                </el-table-column>
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
    </div>
</template>

<script lang="ts">
import Vue from "vue";
// eslint-disable-next-line no-unused-vars
import { Template, Doc } from "../../core/entity/Model";
// eslint-disable-next-line no-unused-vars
import Page from "../../core/common/Page";
import Kit from "../../core/common/Kit";
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
            running: boolean;
            runningFile: string;
        } = {
            tableHeight: document.documentElement.clientHeight - 160,
            tableData: [],
            runningData: [],
            templateData: [],
            running: false,
            runningFile: ""
        };
        return result;
    },
    methods: {
        selectFile(): void {
            let files = ConvCtrl.chooseFile();
            if (files) {
                for (let file of files) {
                    this.add2Queue(file);
                }
            }
        },
        selectTemplate(tempIndex: number, index: number): void {
            let temp: Template = this.templateData[tempIndex];
            this.tableData[index].tempId = temp.id;
            this.tableData[index].tempName = temp.name;
            this.tableData[index].tempIndex = tempIndex;
        },
        add2Queue(filePath: string): void {
            let data: Doc = {
                source: filePath,
                dest: ConvCtrl.getDestPath(filePath),
                finished: false
            };
            this.tableData.unshift(data);
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
                if (Kit.isNull(data.tempId)) {
                    this.runningData = [];
                    messenger.$warning(
                        `请为序号${i + 1}的记录选择模板。`,
                        this
                    );
                    return;
                }
                this.runningData.push({ index: i, data: data });
            }
            if (this.runningData.length < 1) {
                messenger.$warning("请向转换区添加文件", this);
                return;
            }
            let param = this.runningData.shift()!;
            messenger.$emit("lock");
            this.convertOne(param.index, param.data);
        },
        convertOne(index: number, data: Doc): void {
            let v = this;
            let dest = data.dest;
            v.runningFile = dest;
            ConvCtrl.convert(data, index, (index, err) => {
                if (err) {
                    messenger.$error(`文件[${dest}]转换异常`, v);
                    return;
                }
                let data: Doc = v.tableData[index];
                if (Kit.isNotNull(data)) {
                    data.finished = true;
                    messenger.$success(`文件[${dest}]转换成功`, v);
                }
                if (!v.checkFinish()) {
                    let param = v.runningData.shift()!;
                    v.convertOne(param.index, param.data);
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
            TempCtrl.all()
                .then((data: Template[]) => {
                    this.resetTableTemplate();
                    this.templateData = data;
                })
                .catch(() => {
                    messenger.$error("获取模板信息异常", this);
                });
        },
        resetTableTemplate(): void {
            for (let data of this.tableData) {
                if (data.finished) {
                    continue;
                }
                data.tempId = undefined;
                data.tempName = undefined;
                data.tempIndex = undefined;
            }
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
                    document.documentElement.clientHeight - 160;
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
.check-success {
    color: #2b8630;
    font-size: 18px;
}
.check-loading {
    font-size: 18px;
}
.running {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: keep-all;
}
</style>

