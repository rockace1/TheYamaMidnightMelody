interface ExcelColumn {
    name: string | null;
    type: number | null;
}

import {
    Model, Table, Column, DataType, AllowNull, Comment, IsInt, ForeignKey
} from 'sequelize-typescript';

import TemplateDO from './TemplateDO';

@Table({
    tableName: 'excel_column',
    indexes: [{ unique: false, name: 'column_index', using: 'BTREE', fields: ['tempId'] }]
})
class ColumnDO extends Model<ColumnDO>{

    @AllowNull(false)
    @Comment('模板ID')
    @ForeignKey(() => TemplateDO)
    @Column(DataType.BIGINT)
    tempId?: number;

    @AllowNull(false)
    @Comment('列名称')
    @Column(DataType.STRING)
    name?: string;

    @AllowNull(false)
    @Comment('列类型')
    @IsInt
    @Column(DataType.INTEGER)
    type?: number;
}

export default ColumnDO