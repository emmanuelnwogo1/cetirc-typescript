import { Request, Response } from "express";
import { createGroup } from "../../services/group/smartLockGroupService";

export const createGroupController = async (req: Request, res: Response) => {
    const { name, description } = req.body;

    const result = await createGroup({ name, description });

    res.status(result.statusCode).json({
        status: result.status,
        message: result.message,
        data: result.data
    });
};
