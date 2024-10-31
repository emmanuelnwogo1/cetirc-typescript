import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    DataType,
    AllowNull,
    Default,
  } from 'sequelize-typescript';
  
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
    email!: string;
  
    @AllowNull(false)
    @Column(DataType.STRING)
    password!: string;
  
    @AllowNull(true)
    @Column(DataType.STRING)
    first_name?: string;

    @AllowNull(true)
    @Column(DataType.STRING)
    last_name?: string;

    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    is_superuser!: boolean;

    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    is_staff!: boolean;

    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    is_active!: boolean;

    @AllowNull(false)
    @Column(DataType.DATE)
    date_joined!: Date;
}
  