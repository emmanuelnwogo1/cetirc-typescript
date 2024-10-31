import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    DataType,
    AllowNull,
} from 'sequelize-typescript';

@Table({ tableName: 'image_processing_app_businessprofile', timestamps: false })
export class BusinessProfile extends Model<BusinessProfile> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @AllowNull(true)
    @Column(DataType.STRING(100))
    name?: string;

    @AllowNull(false)
    @Column(DataType.STRING(254))
    email!: string;

    @AllowNull(true)
    @Column(DataType.DATE)
    uploaded_at?: Date;

    @AllowNull(true)
    @Column(DataType.STRING(50))
    device_id?: string;

    @AllowNull(true)
    @Column(DataType.TEXT)
    address?: string;

    @AllowNull(true)
    @Column(DataType.STRING(100))
    bank_name?: string;

    @AllowNull(true)
    @Column(DataType.STRING(100))
    city?: string;

    @AllowNull(true)
    @Column(DataType.STRING(100))
    state?: string;

    @AllowNull(true)
    @Column(DataType.STRING(20))
    zip_code?: string;

    @AllowNull(true)
    @Column(DataType.STRING(36))
    withdraw_code?: string;

    @AllowNull(true)
    @Column(DataType.STRING(128))
    password?: string;

    @AllowNull(true)
    @Column(DataType.DECIMAL)
    latitude?: number;

    @AllowNull(true)
    @Column(DataType.DECIMAL)
    longitude?: number;

    @AllowNull(true)
    @Column(DataType.INTEGER)
    user_id?: number;

    @AllowNull(true)
    @Column(DataType.STRING(20))
    account_name?: string;

    @AllowNull(true)
    @Column(DataType.STRING(20))
    iban?: string;

    @AllowNull(true)
    @Column(DataType.BIGINT)
    dashboard_id?: number;

    @AllowNull(true)
    @Column(DataType.STRING(100))
    closing_hours?: string;

    @AllowNull(true)
    @Column(DataType.STRING(20))
    number?: string;

    @AllowNull(true)
    @Column(DataType.STRING(100))
    opening_hours?: string;

    @AllowNull(true)
    @Column(DataType.STRING(200))
    website_url?: string;

    @AllowNull(true)
    @Column(DataType.STRING(100))
    image?: string;

    toJSON() {
        const attributes = { ...this.get() };
        delete attributes.password; // Exclude password
        return attributes;
    };
}
