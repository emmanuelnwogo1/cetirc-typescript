import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer token
    const jwtTokenSecret = process.env.JWT_SECRET!;

    if (!token) {
        res.status(401).json({ error: 'No token provided' });
        return;
    }

    jwt.verify(token, jwtTokenSecret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        next();
    });
};

export default verifyToken;
