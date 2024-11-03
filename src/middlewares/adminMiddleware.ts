import { Request, Response, NextFunction } from 'express';
import verifyToken from './authMiddleware';
import { User } from '../models/User';

const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await verifyToken(req, res, next);

    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user || !user.is_superuser) {
      res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'You are not allowed to access these routes.' });
  }
};

export default adminMiddleware;
