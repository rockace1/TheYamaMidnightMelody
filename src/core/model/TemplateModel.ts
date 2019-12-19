import {
    Model, Table, Column, DataType, AutoIncrement, AllowNull, PrimaryKey, Comment, HasMany
} from 'sequelize-typescript';
import ColumnModel from './ColumnModel';

@Table({ tableName: 'excel_template' })
class TemplateModel extends Model<TemplateModel>{

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
    @Comment('创建时间')
    @Column(DataType.DATE)
    date!: Date;

    @HasMany(() => ColumnModel)
    columns!: Array<ColumnModel>;
}

export default TemplateModel