import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    DataType,
    ForeignKey,
    AllowNull,
    BelongsTo
} from 'sequelize-typescript';
import { SmartLockGroup } from './SmartLockGroup';

@Table({ tableName: 'image_processing_app_room', timestamps: false })
export class Room extends Model<Room> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    room_id!: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    name!: string;

    @AllowNull(false)
    @Column(DataType.BOOLEAN)
    is_active!: boolean;

    @ForeignKey(() => SmartLockGroup)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    group_id!: number;

    @BelongsTo(() => SmartLockGroup)
    smartLockGroup!: SmartLockGroup;
}
