import {
    Table,
    Column,
    Model,
    PrimaryKey,
    DataType,
    AllowNull,
    BelongsTo,
    ForeignKey,
    AutoIncrement,
} from 'sequelize-typescript';
import { User } from './User';

@Table({ tableName: 'image_processing_app_userprofile', timestamps: false })
export class UserProfile extends Model<UserProfile> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    email!: string;

    @Column(DataType.STRING)
    image?: string;

    @Column(DataType.DATE)
    uploaded_at?: Date;

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    username_id!: number;

    @Column(DataType.STRING)
    business_associated?: string;

    @Column(DataType.STRING)
    device_id?: string;

    @Column(DataType.STRING)
    city?: string;

    @Column(DataType.STRING)
    state?: string;

    @Column(DataType.STRING)
    street?: string;

    @Column(DataType.STRING)
    zip_code?: string;

    @AllowNull(true)
    @Column(DataType.STRING)
    stripe_customer_id?: string;

    @BelongsTo(() => User)
    user!: User;
}
