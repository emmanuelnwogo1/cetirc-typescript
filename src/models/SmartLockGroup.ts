import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    DataType,
    AllowNull
} from 'sequelize-typescript';

@Table({ tableName: 'image_processing_app_smartlockgroup', timestamps: false })
export class SmartLockGroup extends Model<SmartLockGroup> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    name!: string;

    @AllowNull(true)
    @Column(DataType.STRING)
    description?: string;
}
