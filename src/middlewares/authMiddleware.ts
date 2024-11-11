import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    const token = (req.headers['authorization'] as string)?.split(' ')[1];
    const jwtTokenSecret = process.env.JWT_SECRET!;

    if (!token) {
        res.status(401).json({ error: 'No token provided' });
        return;
    }

    jwt.verify(token, jwtTokenSecret, (err: any, decoded: any) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        req.user = decoded;
        next();
    });
};

export default verifyToken;
