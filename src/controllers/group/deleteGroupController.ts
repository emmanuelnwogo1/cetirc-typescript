import { Request, Response } from 'express';
import { deleteGroupService } from '../../services/group/deleteGroupService';

export const deleteGroupController = async (req: Request, res: Response) => {
    const groupId = parseInt(req.params.group_id, 10);
    const userId = req.user.id;

    const result = await deleteGroupService(groupId, userId);

    res.status(result.statusCode).json(result);
};