import { Request, Response } from 'express';
import { removeUserAccessFromRoom } from '../../../services/room/smartlock/access/deleteUserAccessFromRoomService';

export const deleteUserAccessFromRoomController = async (req: Request, res: Response) => {
    const { user_id, room_id } = req.body;
    const result = await removeUserAccessFromRoom(user_id, room_id, req.user);
    res.status(result.statusCode).json(result.data);
};
