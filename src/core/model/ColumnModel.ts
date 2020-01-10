import {
    Model, Table, Column, DataType, AllowNull, Comment, IsInt, ForeignKey
} from 'sequelize-typescript';

import TemplateModel from './TemplateModel';

@Table({
    tableName: 'excel_column',
    indexes: [{ unique: false, name: 'column_index', using: 'BTREE', fields: ['tempId'] }]
})
export default class ColumnModel extends Model<ColumnModel>{

    @AllowNull(false)
    @Comment('模板ID')
    @ForeignKey(() => TemplateModel)
    @Column(DataType.BIGINT)
    tempId!: number;

    @AllowNull(true)
    @Comment('列名称')
    @Column(DataType.STRING)
    name?: string;

    @AllowNull(false)
    @Comment('列类型')
    @IsInt
    @Column(DataType.INTEGER)
    type!: number;
}