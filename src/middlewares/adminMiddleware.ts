import { Request, Response, NextFunction } from 'express';
import verifyToken from './authMiddleware';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';

const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = (req.headers['authorization'] as string)?.split(' ')[1];
    const jwtTokenSecret = process.env.JWT_SECRET!;

    jwt.verify(token, jwtTokenSecret, async (err: any, decoded: any) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }else{
            const userId = req.user.id;

            const user = await User.findByPk(userId);
            if (!user || !user.is_superuser) {
                res.status(403).json({ message: 'Access denied. Admins only.' });
                return;
            }
            next();
        }
    });

  } catch (error) {
    res.status(500).json({ message: 'You are not allowed to access these routes.' });
  }
};

export default adminMiddleware;
