import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/User';
import { BusinessProfile } from '../models/BusinessProfile';
import { BusinessDashboard } from '../models/BusinessDashboard';
import { PalmShare } from '../models/PalmShare';
import { TransactionHistory } from '../models/TransactionHistory';
import { PasswordResetRequest } from '../models/PasswordResetRequest';
import { Card } from '../models/Card';
import { UserProfile } from '../models/UserProfile';
import { SmartLock } from '../models/SmartLock';
import { SmartLockGroup } from '../models/SmartLockGroup';
import { UserSmartLockAccess } from '../models/UserSmartLockAccess';
import { BusinessSmartLock } from '../models/BusinessSmartLock';
import { Room } from '../models/Room';
import { Notification } from '../models/Notification';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  models: [User, BusinessProfile, BusinessDashboard, PalmShare, TransactionHistory,
        PasswordResetRequest, Card, UserProfile,
        SmartLock, SmartLockGroup, UserSmartLockAccess,
        BusinessSmartLock, Room, Notification
    ],
});

export default sequelize;
