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
    @Column(DataType.STRING)
    name!: string;

    @AllowNull(false)
    @Length({ min: 16, max: 16 })
    @Column(DataType.STRING(16))
    card_number!: string;

    @AllowNull(false)
    @Column(DataType.INTEGER)
    expiration_month_year!: number;

    @AllowNull(false)
    @Length({ min: 3, max: 3 })
    @Column(DataType.STRING(3))
    cvv!: string;

    @AllowNull(false)
    @Column(DataType.INTEGER)
    user_profile_id!: number;
}
