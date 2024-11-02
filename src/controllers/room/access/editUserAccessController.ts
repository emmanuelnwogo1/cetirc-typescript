import { Request, Response } from "express";
import { updateUserAccess } from "../../../services/room/smartlock/access/userAccessService";

export const editUserAccessController = async (req: Request, res: Response) => {
    const userId = req.params.user_id;
    const result = await updateUserAccess(userId, req.body, req.user);
    res.status(result.statusCode).json(result.data);
};