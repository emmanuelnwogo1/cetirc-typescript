// models/Transaction.ts

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
import { User } from './User'; // Adjust the import based on your user model

@Table({ tableName: 'transactions', timestamps: false }) // Adjust table name if needed
export class Transaction extends Model<Transaction> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @AllowNull(false)
    @Column(DataType.DECIMAL) // Assuming amount is a decimal; adjust if needed
    amount!: number;

    @AllowNull(false)
    @Column(DataType.DATE) // Assuming transaction_date is a date
    transactionDate!: Date;

    @AllowNull(false)
    @Column(DataType.BOOLEAN) // Assuming success is a boolean
    success!: boolean;

    @ForeignKey(() => Business) // Assuming there's a Business model
    @AllowNull(false)
    @Column(DataType.INTEGER)
    businessId!: number;

    @ForeignKey(() => User) // Assuming payer_user_id references User
    @AllowNull(false)
    @Column(DataType.INTEGER)
    payerUserId!: number;

    @ForeignKey(() => User) // Assuming user_id references User
    @AllowNull(false)
    @Column(DataType.INTEGER)
    userId!: number;
}
