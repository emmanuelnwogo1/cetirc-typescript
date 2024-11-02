import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    DataType,
    AllowNull,
    ForeignKey,
} from 'sequelize-typescript';
import { User } from './User';

@Table({ tableName: 'image_processing_app_notification', timestamps: false })
export class Notification extends Model<Notification> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    message!: string;

    @AllowNull(false)
    @Column(DataType.BOOLEAN)
    is_read!: boolean;

    @AllowNull(false)
    @Column(DataType.DATE)
    created_at!: Date;

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    user_id!: number;
}
