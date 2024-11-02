import {
    Table,
    Column,
    Model,
    PrimaryKey,
    DataType,
    AllowNull,
} from 'sequelize-typescript';

@Table({ tableName: 'image_processing_app_userprofile', timestamps: false })
export class UserProfile extends Model<UserProfile> {
    @PrimaryKey
    @Column(DataType.INTEGER)
    id!: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    email!: string;

    @Column(DataType.STRING)
    image?: string;

    @Column(DataType.DATE)
    uploaded_at?: Date;

    @Column(DataType.STRING)
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
}
