import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    DataType,
    AllowNull,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';
import { User } from './User';

@Table({ tableName: 'image_processing_app_passwordresetrequest', timestamps: false })
export class PasswordResetRequest extends Model<PasswordResetRequest> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id!: number;

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.BIGINT)
    user_id!: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    pin!: string; 

    @AllowNull(false)
    @Column(DataType.DATE)
    expires_at!: Date;

    @AllowNull(true)
    @Column(DataType.DATE)
    created_at!: Date;

    @BelongsTo(() => User, { foreignKey: 'user_id', as: 'user' })
    user!: User;
}
