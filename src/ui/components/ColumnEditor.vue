<template>
    <el-row>
        <el-col :span="10" style="margin:5px;">
            <el-form-item :label="'第'+(i+1)+'列'" label-width="120px">
                <el-input
                    autocomplete="off"
                    placeholder="表头名"
                    v-model="col.name"
                    @change="change(i,col)"
                ></el-input>
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
            <i
                class="el-icon-circle-plus icon"
                style="margin-right:5px;color:#2b8630"
                @click="add(i)"
            ></i>
            <i class="el-icon-remove icon" style="margin-left:5px;color:#ff4a4a" @click="del(i)"></i>
        </el-col>
    </el-row>
</template>

<script lang="ts">
import Vue from "vue";
// eslint-disable-next-line no-unused-vars
import { Column } from "../../core/entity/Model";
import {
    default as ColumnTypeData,
    // eslint-disable-next-line no-unused-vars
    ColumnType
} from "../../core/common/Constant";

export default Vue.extend({
    props: {
        i: Number,
        col: Object
    },
    methods: {
        change(index: number, col: Column): void {
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
        let result: { colType: ReadonlyArray<ColumnType> } = {
            colType: ColumnTypeData
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