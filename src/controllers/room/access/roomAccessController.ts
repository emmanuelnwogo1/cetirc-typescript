import { Request, Response } from "express";
import { getUserAccessInRoom, grantUserAccess } from "../../../services/room/smartlock/access/roomAccessService";

export const viewUserAccessInRoomController = async (req: Request, res: Response) => {
    const roomId = parseInt(req.params.room_id);
    const result = await getUserAccessInRoom(roomId, req.user);
    res.status(result.statusCode).json(result.data);
};

export const createUserAccessController = async (req: Request, res: Response) => {
    const businessType = req.params.business_type;
    const result = await grantUserAccess(req.body, businessType, req.user);
    res.status(result.statusCode).json(result.data);
};