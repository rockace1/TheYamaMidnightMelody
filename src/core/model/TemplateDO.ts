import {
    Model, Table, Column, DataType, Is, AutoIncrement, AllowNull, PrimaryKey, Comment, IsInt, ForeignKey, HasMany
} from 'sequelize-typescript';
import ColumnDO from './ColumnDO';

@Table({tableName:'excel_template'})
class TemplateDO extends Model<TemplateDO>{

    @AutoIncrement
    @AllowNull(false)
    @Comment('ID')
    @Column(DataType.BIGINT)
    id?:number;

    @AllowNull(false)
    @Comment('模板名称')
    @Column(DataType.STRING)
    name?: string;

    @AllowNull(false)
    @Comment('创建时间')
    @Column(DataType.DATE)
    date?: string;

    @HasMany(() => ColumnDO)
    columns?: Array<ColumnDO>;
}

export default TemplateDO