import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    DataType,
    ForeignKey,
    BelongsTo,
    AllowNull,
  } from 'sequelize-typescript';
  import { BusinessProfile } from './BusinessProfile';
  import { SmartLock } from './SmartLock';
  import { SmartLockGroup } from './SmartLockGroup';
  
  @Table({ tableName: 'image_processing_app_businesssmartlock', timestamps: false })
  export class BusinessSmartLock extends Model<BusinessSmartLock> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;
  
    @ForeignKey(() => BusinessProfile)
    @Column(DataType.INTEGER)
    business_profile_id!: number;
  
    @ForeignKey(() => SmartLockGroup)
    @AllowNull(true)
    @Column(DataType.INTEGER)
    business_type_id?: number;
  
    @ForeignKey(() => SmartLock)
    @Column(DataType.INTEGER)
    smart_lock_id!: number;
  
    @BelongsTo(() => BusinessProfile)
    businessProfile!: BusinessProfile;
  
    @BelongsTo(() => SmartLockGroup)
    businessType!: SmartLockGroup;
  
    @BelongsTo(() => SmartLock)
    smartLock!: SmartLock;
  }
  