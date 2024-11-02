import { Request, Response } from 'express';
import { getUserNotifications } from '../../services/notification/notificationService';

export const getNotificationsController = async (req: Request, res: Response) => {
    const result = await getUserNotifications(req.user.id);
    res.status(result.statusCode).json(result.data);
};
