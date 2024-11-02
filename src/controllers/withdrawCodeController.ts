import { Request, Response } from "express";
import { getWithdrawCode } from "../services/withdrawCodeService";

export const getWithdrawCodeController = async (req: Request, res: Response) => {
    const userId = req.user.id;

    const result = await getWithdrawCode(userId);
    
    res.status(result.statusCode).json({
        status: result.status,
        message: result.message,
        data: result.data
    });
};
