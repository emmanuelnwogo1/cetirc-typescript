import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import sequelize from './config/database';
import businessRoutes from './routes/businessRoutes';
import businessDashboardRoutes from './routes/businessDashboardRoutes';
import palmShareRoutes from './routes/palmShareRoutes';
import transactionRoutes from './routes/transactionRoutes';
import './types/global';
import passwordResetRoutes from './routes/passwordResetRoutes';
import cardRoutes from './routes/cardRoutes';
import userRoutes from './routes/userRoutes';
import userSmartLockRoutes from './routes/userSmartLockRoutes';
import notificationRoutes from './routes/notificationRoutes';
import roomRoutes from './routes/roomRoutes';

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', businessRoutes);
app.use('/api', businessDashboardRoutes);
app.use('/api', palmShareRoutes);
app.use('/api', transactionRoutes);
app.use('/api', passwordResetRoutes);
app.use('/api', cardRoutes);
app.use('/api', userRoutes);
app.use('/api', userSmartLockRoutes);
app.use('/api', roomRoutes);
app.use('/api', notificationRoutes);

sequelize.sync();
export default app;
