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
import { BusinessProfile } from './BusinessProfile';

@Table({ tableName: 'image_processing_app_transaction', timestamps: false })
export class Transaction extends Model<Transaction> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @AllowNull(false)
    @Column(DataType.DECIMAL)
    amount!: number;

    @AllowNull(false)
    @Column(DataType.DATE)
    transaction_date!: Date;

    @AllowNull(false)
    @Column(DataType.BOOLEAN)
    success!: boolean;

    @ForeignKey(() => BusinessProfile)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    business_id!: number;

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    payer_user_id!: number;

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    user_id!: number;

    @BelongsTo (() => User)
    user!: User
}
