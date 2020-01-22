<template>
    <el-row>
        <el-col :span="8" style="margin:5px;">
            <el-form-item :label="'第'+(i+1)+'列'" label-width="115px">
                <el-input placeholder="表头名" v-model="col.name" @change="change(i,col)"></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="4" style="margin:5px;">
            <el-select v-model="col.type" placeholder="列类型" @change="change(i,col)">
                <template v-for="(type,j) in colType">
                    <el-option :key="j" :label="type.name" :value="type.value"></el-option>
                </template>
            </el-select>
        </el-col>
        <el-col :span="9">
            <el-col :span="12" style="margin:5px;">
                <el-form-item label="小数位数" v-if="isDecimal(col.type)" label-width="68px">
                    <el-input
                        v-model="decimalPlaces"
                        type="number"
                        @change="change(i,col)"
                        :min="0"
                        :max="10"
                        controls-position="right"
                    ></el-input>
                </el-form-item>
                <el-form-item label="分母位数" v-else-if="isFraction(col.type)" label-width="68px">
                    <el-input
                        v-model="digits"
                        type="number"
                        @change="change(i,col)"
                        :min="0"
                        :max="10"
                        controls-position="right"
                    ></el-input>
                </el-form-item>
                <el-form-item label="自定格式" v-else-if="isCustom(col.type)" label-width="68px">
                    <el-input v-model="col.fmt" @change="change(i,col)"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8" style="margin:5px;">
                <el-form-item label="货币符号" v-if="isCurrency(col.type)" label-width="68px">
                    <el-input v-model="symbol" @change="change(i,col)"></el-input>
                </el-form-item>
                <el-form-item label="是否数字" v-if="isCustom(col.type)" label-width="68px">
                    <el-switch
                        v-model="isNum"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        :active-value="true"
                        :inactive-value="false"
                        @change="change(i,col)"
                    ></el-switch>
                </el-form-item>
            </el-col>
        </el-col>
        <el-col :span="2" style="margin:15px 0px 0px 0px;">
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
import Kit from "../../core/common/Kit";
// eslint-disable-next-line no-unused-vars
import { Column, ColumnProp } from "../../core/entity/Model";
import {
    default as ColumnTypeData,
    // eslint-disable-next-line no-unused-vars
    ColumnType
} from "../../core/common/Constant";

export default Vue.extend({
    props: {
        i: Number,
        col: Object,
        colProp: Array
    },
    methods: {
        change(index: number, col: Column): void {
            let type = col.type;
            if (Kit.isCustom(type)) {
                col.prop = { isNum: this.isNum };
            } else if (Kit.isFraction(type)) {
                col.prop = {
                    digits: Kit.isNull(this.digits) ? 1 : this.digits
                };
            } else if (Kit.isDecimal(type)) {
                let p: any = {
                    decimalPlaces: Kit.isNull(this.decimalPlaces)
                        ? 2
                        : this.decimalPlaces
                };
                if (Kit.isCurrency(type)) {
                    p.symbol = Kit.isNull(this.symbol) ? "¥" : this.symbol;
                }
                col.prop = p;
            }
            this.$emit("change", index, col);
        },
        changeProp(index: number, prop: string): void {
            console.log(`index:${index},prop:${prop}`);
        },
        add(index: number): void {
            this.$emit("add", index);
        },
        del(index: number): void {
            this.$emit("del", index);
        },
        isCustom(type: number): boolean {
            return Kit.isCustom(type);
        },
        isCurrency(type: number): boolean {
            return Kit.isCurrency(type);
        },
        isFraction(type: number): boolean {
            return Kit.isFraction(type);
        },
        isDecimal(type: number): boolean {
            return Kit.isDecimal(type);
        }
    },
    data() {
        let result: {
            colType: ReadonlyArray<ColumnType>;
            decimalPlaces: number | undefined;
            symbol: string | undefined;
            isNum: boolean;
            digits: number | undefined;
        } = {
            colType: ColumnTypeData,
            decimalPlaces: 2,
            symbol: "¥",
            isNum: false,
            digits: 2
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