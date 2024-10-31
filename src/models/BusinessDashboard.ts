import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    DataType,
    AllowNull,
    Unique,
    Default,
} from 'sequelize-typescript';

@Table({ tableName: 'image_processing_app_businessdashboard', timestamps: false })
export class BusinessDashboard extends Model<BusinessDashboard> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @AllowNull(false)
    @Default(0)
    @Column(DataType.INTEGER)
    total_transactions!: number;

    @AllowNull(false)
    @Column(DataType.DECIMAL)
    total_revenue!: number;

    @AllowNull(false)
    @Column(DataType.DECIMAL)
    balance!: number;

    @AllowNull(true)
    @Column(DataType.STRING(20))
    withdraw_code?: string;

    @AllowNull(true)
    @Unique
    @Column(DataType.BIGINT)
    business_id?: number;
}
