import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    DataType,
    AllowNull,
    ForeignKey,
    BelongsTo
} from 'sequelize-typescript';
import { SmartLockGroup } from './SmartLockGroup';
import { Room } from './Room';

@Table({ tableName: 'image_processing_app_smartlock', timestamps: false })
export class SmartLock extends Model<SmartLock> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    device_id!: string;

    @AllowNull(true)
    @Column(DataType.STRING)
    name?: string;

    @AllowNull(true)
    @Column(DataType.DATE)
    created_at?: Date;

    @AllowNull(true)
    @ForeignKey(() => SmartLockGroup)
    @Column(DataType.INTEGER)
    group_id?: number;

    @AllowNull(true)
    @ForeignKey(() => Room)
    @Column(DataType.INTEGER)
    room_id?: number;

    @BelongsTo(() => SmartLockGroup)
    smartLockGroup?: SmartLockGroup;

    @BelongsTo(() => Room)
    room?: Room; 
}
