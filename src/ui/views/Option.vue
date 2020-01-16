<template>
    <div class="main-container">
        <el-form :model="form" label-width="80px">
            <el-form-item label="默认文件夹">
                <el-input v-model="form[keys['BASE_FOLDER']]"></el-input>
            </el-form-item>
            <el-form-item label="文件扩展名">
                <el-input v-model="form[keys['EXT']]"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="save()">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { OptionKey } from "../../core/common/Constant";

export default Vue.extend({
    data() {
        let result = {
            keys: OptionKey,
            form: {}
        };
        return result;
    },
    methods: {
        save(): void {
            console.log(this.form);
        }
    }
});
</script>