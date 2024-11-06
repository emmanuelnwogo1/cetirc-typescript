import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    DataType,
    AllowNull,
    Default,
    HasOne,
  } from 'sequelize-typescript';
import { UserProfile } from './UserProfile';
  
  @Table({ tableName: 'auth_user', timestamps: false })
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
    email?: string;
  
    @AllowNull(false)
    @Column(DataType.STRING)
    password!: string;
  
    @AllowNull(true)
    @Column(DataType.STRING)
    first_name?: string;

    @AllowNull(true)
    @Column(DataType.STRING)
    last_name?: string;

    @AllowNull(true)
    @Default(false)
    @Column(DataType.BOOLEAN)
    is_superuser?: boolean;

    @AllowNull(true)
    @Default(false)
    @Column(DataType.BOOLEAN)
    is_staff?: boolean;

    @AllowNull(true)
    @Default(false)
    @Column(DataType.BOOLEAN)
    is_active?: boolean;

    @AllowNull(true)
    @Column(DataType.DATE)
    date_joined!: Date;

    @HasOne (() => UserProfile)
    userProfile!: UserProfile
}