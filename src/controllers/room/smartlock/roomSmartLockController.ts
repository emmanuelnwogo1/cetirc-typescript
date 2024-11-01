import { Request, Response } from 'express';
import { addSmartLockToRoom } from '../../../services/room/smartlock/roomSmartLockService';

export const roomSmartLockController = async (req: Request, res: Response) => {
    const roomId = parseInt(req.params.id);
    const smartLockDeviceId = req.body.smart_lock_device_id;

    const result = await addSmartLockToRoom(roomId, smartLockDeviceId);
    res.status(result.statusCode).json(result.data);
};