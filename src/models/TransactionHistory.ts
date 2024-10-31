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

@Table({ tableName: 'image_processing_app_transactionhistory', timestamps: false })
export class TransactionHistory extends Model<TransactionHistory> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id!: number;

    @AllowNull(false)
    @Column(DataType.BIGINT)
    transaction_id!: string;

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.BIGINT)
    user_id!: number;
}
