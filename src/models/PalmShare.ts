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

@Table({ tableName: 'image_processing_app_palmshare', timestamps: false })
export class PalmShare extends Model<PalmShare> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    owner_id!: number;

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    allowed_user_id!: number;

    @AllowNull(false)
    @Column(DataType.DECIMAL)
    max_amount!: number;

    @BelongsTo(() => User, { foreignKey: 'owner_id', as: 'owner' })
    owner!: User;

    @BelongsTo(() => User, { foreignKey: 'allowed_user_id', as: 'allowedUser' })
    allowedUser!: User;
}
