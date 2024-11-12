import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    DataType,
    AllowNull,
    Length,
} from 'sequelize-typescript';

@Table({ tableName: 'image_processing_app_card', timestamps: false })
export class Card extends Model<Card> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @AllowNull(false)
    @Column(DataType.INTEGER)
    user_profile_id!: number;

    @AllowNull(true)
    @Column(DataType.STRING)
    stripe_payment_method_id?: string;

    @AllowNull(false)
    @Length({ max: 50 })
    @Column(DataType.STRING)
    brand!: string;

    @AllowNull(false)
    @Column(DataType.STRING(4))
    last_four_digits!: string;

    @AllowNull(true)
    @Column(DataType.BOOLEAN)
    is_default?: boolean;
}
