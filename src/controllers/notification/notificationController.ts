import { Request, Response } from 'express';
import { getNotificationById, getUserNotifications, updateNotificationById } from '../../services/notification/notificationService';

export const getNotificationsController = async (req: Request, res: Response) => {
    const result = await getUserNotifications(req.user.id);
    res.status(result.status_code).json(result.data);
};

export const updateNotificationByIdController = async (req: Request, res: Response) => {
    const userId = req.user.id;
    const notificationId = parseInt(req.params.id, 10);

    try{
        const result = await updateNotificationById(userId, notificationId, req.body);
        res.status(200).json(result);
    }catch(e: any){
        res.status(404).json({
            status: "failed",
            message: "Notification not found.",
            data: {}
        });
    }
};

export const getNotificationByIdController = async (req: Request, res: Response) => {
    const userId = req.user.id;
    const notificationId = parseInt(req.params.id, 10);

    try{
        const result = await getNotificationById(notificationId, userId);
        res.status(200).json(result);
    }catch(e: any){
        res.status(404).json({
            status: "failed",
            message: "Notification not found.",
            data: {}
        });
    }
};

