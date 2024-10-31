import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    DataType,
    AllowNull,
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
  }
  