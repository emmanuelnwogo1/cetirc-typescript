import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import sequelize from './config/database';
import businessRoutes from './routes/businessRoutes';
import businessDashboardRoutes from './routes/businessDashboardRoutes';
import './types/global';

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', businessRoutes);
app.use('/api', businessDashboardRoutes);

sequelize.sync();
export default app;
