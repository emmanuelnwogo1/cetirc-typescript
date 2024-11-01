import { Request, Response } from "express";
import { getUserAccessInRoom } from "../../../services/room/smartlock/access/roomAccessService";

export const viewUserAccessInRoomController = async (req: Request, res: Response) => {
    const roomId = parseInt(req.params.room_id);
    const result = await getUserAccessInRoom(roomId, req.user);
    res.status(result.statusCode).json(result.data);
};