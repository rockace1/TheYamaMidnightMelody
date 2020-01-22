<template>
    <div class="main-container">
        <el-form :model="form" label-width="180px">
            <el-form-item label="默认文件夹">
                <div @click="openFolder()">
                    <el-input
                        v-model="form[keys['BASE_FOLDER']]"
                        id="folder"
                        placeholder="文件转换选择文件时默认打开的文件夹"
                        disabled
                    ></el-input>
                </div>
            </el-form-item>
            <el-form-item label="文件扩展名">
                <el-input
                    v-model="form[keys['EXT']]"
                    placeholder="文件转换时可见的文件扩展名「txt」，多个用英文逗号分隔「txt,htm,xml」"
                ></el-input>
            </el-form-item>
            <el-form-item label="重置软件" style="text-align:left">
                <el-switch v-model="form[keys['CLEAN']]" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item style="text-align:right">
                <el-button type="primary" @click="save()">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
// eslint-disable-next-line no-unused-vars
import { Option } from "../../core/entity/Model";
import { OptionKey } from "../../core/common/Constant";
import messenger from "../router/messenger";
import OptionCtrl from "../controller/OptionController";

export default Vue.extend({
    data() {
        let result = {
            keys: OptionKey,
            form: {
                [OptionKey.BASE_FOLDER]: "",
                [OptionKey.EXT]: "",
                [OptionKey.CLEAN]: 0
            }
        };
        return result;
    },
    methods: {
        save(): void {
            let v = this;
            OptionCtrl.save(this.form).then(() => {
                messenger.$success(`选项保存成功`, v);
            });
        },
        openFolder(): void {
            let p: string | undefined = OptionCtrl.chooseFile();
            if (p) {
                this.form[OptionKey.BASE_FOLDER] = p;
            }
        },
        allOption(): void {
            OptionCtrl.all().then((array: Option[]) => {
                for (let i = 0; i < array.length; i++) {
                    this.executeFormValue(array[i]);
                }
            });
        },
        executeFormValue(option: Option): void {
            switch (option.key) {
                case OptionKey.BASE_FOLDER: {
                    this.form[OptionKey.BASE_FOLDER] = option.value!;
                    break;
                }
                case OptionKey.EXT: {
                    this.form[OptionKey.EXT] = option.value!;
                    break;
                }
                case OptionKey.CLEAN: {
                    this.form[OptionKey.CLEAN] = Number(option.value);
                    break;
                }
            }
        }
    },
    mounted: function() {
        let input = document.getElementById("folder");
        if (input) {
            input.style.cssText = "cursor: pointer;";
        }
        this.allOption();
    }
});
</script>

<style scoped>
form {
    position: absolute;
    margin-top: 20px;
    padding-top: 20px;
    margin-left: 120px;
    width: 680px;
}
</style>