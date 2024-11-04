import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    DataType,
    AllowNull,
} from 'sequelize-typescript';

@Table({ tableName: 'image_processing_app_permission', timestamps: false })
export class Permission extends Model<Permission> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    name!: string;
}
