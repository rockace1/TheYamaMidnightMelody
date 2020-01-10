import {
    Model, Table, Column, DataType, AutoIncrement, AllowNull, PrimaryKey, Comment, HasMany, CreatedAt
} from 'sequelize-typescript';
import ColumnModel from './ColumnModel';

@Table({ tableName: 'excel_template' })
export default class TemplateModel extends Model<TemplateModel>{

    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @Comment('ID')
    @Column(DataType.BIGINT)
    id!: number;

    @AllowNull(false)
    @Comment('模板名称')
    @Column(DataType.STRING)
    name!: string;

    @AllowNull(false)
    @Comment('分隔符')
    @Column(DataType.STRING)
    delimiter!: string;

    @Comment('创建时间')
    @CreatedAt
    @Column(DataType.DATE)
    readonly date!: Date;

    @HasMany(() => ColumnModel)
    columns!: Array<ColumnModel>;
}