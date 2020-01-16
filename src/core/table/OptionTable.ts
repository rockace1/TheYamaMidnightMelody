import {
    Model, Table, Column, DataType, AutoIncrement, AllowNull, PrimaryKey, Comment
} from 'sequelize-typescript';

@Table({
    tableName: 'excel_option',
    indexes: [{ unique: true, name: 'option_unique', using: 'BTREE', fields: ['key'] }]
})
export default class OptionTable extends Model<OptionTable>{

    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @Comment('ID')
    @Column(DataType.INTEGER)
    id!: number;

    @AllowNull(false)
    @Comment('选项key')
    @Column(DataType.INTEGER)
    key!: number;

    @AllowNull(false)
    @Comment('选项value')
    @Column(DataType.STRING)
    value!: string;
}