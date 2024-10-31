import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    DataType,
    AllowNull,
  } from 'sequelize-typescript';
  
  @Table
  export class User extends Model<User> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;
  
    @AllowNull(false)
    @Column(DataType.STRING)
    username!: string;
  
    @AllowNull(false)
    @Column(DataType.STRING)
    email!: string;
  
    @AllowNull(false)
    @Column(DataType.STRING)
    password!: string;
  
    @AllowNull(true)
    @Column(DataType.STRING)
    fullName?: string;
  
    @AllowNull(true)
    @Column(DataType.STRING)
    phoneNumber?: string;
  
    @AllowNull(true)
    @Column(DataType.STRING)
    userType?: string;
  
    @AllowNull(true)
    @Column(DataType.STRING)
    profilePicture?: string;
  
    @AllowNull(true)
    @Column(DataType.STRING)
    language?: string;
  
    @AllowNull(true)
    @Column(DataType.BOOLEAN)
    notificationEmail?: boolean;
  
    @AllowNull(true)
    @Column(DataType.BOOLEAN)
    notificationSms?: boolean;
  }
  