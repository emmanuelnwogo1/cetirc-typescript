import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import sequelize from './config/database';

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);

sequelize.sync();
export default app;
