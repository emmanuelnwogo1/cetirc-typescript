import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/User';
import { BusinessProfile } from '../models/BusinessProfile';
import { BusinessDashboard } from '../models/BusinessDashboard';
import { PalmShare } from '../models/PalmShare';
import { TransactionHistory } from '../models/TransactionHistory';
import { PasswordResetRequest } from '../models/PasswordResetRequest';
import { Card } from '../models/Card';
import { UserProfile } from '../models/UserProfile';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  models: [User, BusinessProfile, BusinessDashboard, PalmShare, TransactionHistory, PasswordResetRequest, Card, UserProfile],
});

export default sequelize;
