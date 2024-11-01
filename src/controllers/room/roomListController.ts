import { getRoomsListByBusinessType } from "../../services/room/getRoomListService";
import { Request, Response } from "express";

export const roomListController = async (req: Request, res: Response) => {
    const businessType = req.params.business_type;

    const result = await getRoomsListByBusinessType(businessType);
    res.status(result.statusCode).json(result.data);
};