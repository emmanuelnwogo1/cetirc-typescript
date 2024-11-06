import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    DataType,
    ForeignKey,
    AllowNull,
    Default,
    BelongsTo
} from 'sequelize-typescript';
import { User } from './User';
import { SmartLock } from './SmartLock';
import { Room } from './Room';

@Table({ tableName: 'image_processing_app_usersmartlockaccess', timestamps: false })
export class UserSmartLockAccess extends Model<UserSmartLockAccess> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @AllowNull(false)
    @ForeignKey(() => SmartLock)
    @Column(DataType.INTEGER)
    smart_lock_id!: number;

    @AllowNull(false)
    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    user_id!: number;

    @AllowNull(false)
    @Default(DataType.NOW)
    @Column(DataType.DATE)
    granted_at!: Date;

    @AllowNull(false)
    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    granted_by_id!: number;

    @AllowNull(true)
    @Column(DataType.DATE)
    period?: Date;

    @AllowNull(true)
    @ForeignKey(() => Room)
    @Column(DataType.INTEGER)
    room_id?: number;

    @BelongsTo (() => SmartLock)
    smartLock!: SmartLock

    @BelongsTo (() => User)
    user!: User

    @BelongsTo (() => Room)
    room!: Room
}
