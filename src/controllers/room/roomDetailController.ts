import { Request, Response } from "express";
import { getRoomDetails } from "../../services/room/roomDetailService";

export const roomDetailController = async (req: Request, res: Response) => {
    const businessType = req.params.business_type;
    const roomId = parseInt(req.params.pk);

    const result = await getRoomDetails(businessType, roomId);
    res.status(result.statusCode).json(result.data);
};