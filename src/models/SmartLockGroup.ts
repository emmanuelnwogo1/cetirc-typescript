import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    DataType,
    AllowNull,
    HasMany
} from 'sequelize-typescript';
import { SmartLock } from './SmartLock';

export enum BusinessType {
    APARTMENT = 'apartment',
    SCHOOL = 'school',
    GYM = 'gym',
    HOTEL = 'hotel',
    RETAIL_STORE = 'retail_store',
    COMPANY = 'company',
    AIRBNB = 'airbnb',
    OTHERS = 'others'
}


@Table({ tableName: 'image_processing_app_smartlockgroup', timestamps: false })
export class SmartLockGroup extends Model<SmartLockGroup> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    name!: string;

    @AllowNull(true)
    @Column(DataType.STRING)
    description?: string;
    
    static BUSINESS_TYPES = Object.values(BusinessType);

    @HasMany(() => SmartLock)
    smartLocks?: SmartLock[];
}
