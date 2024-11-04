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
    Default,
} from 'sequelize-typescript';
import { User } from './User';

@Table({ tableName: 'image_processing_app_withdrawal', timestamps: false })
export class Withdrawal extends Model<Withdrawal> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @AllowNull(false)
    @Column(DataType.DECIMAL(10, 2))
    amount!: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    withdraw_code!: string;

    @AllowNull(false)
    @Column(DataType.DATE)
    created_at!: Date;

    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    success!: boolean;

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    business_id!: number;

    @BelongsTo(() => User)
    business!: User;
}
