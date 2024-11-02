import { Request, Response } from 'express';
import { removeUserAccessFromRoom } from '../../../services/room/smartlock/access/deleteUserAccessFromRoomService';

export const deleteUserAccessFromRoomController = async (req: Request, res: Response) => {
    const user_id = parseInt(req.params.user_id, 10);

    if(!user_id){
        res.status(404).json({
            status: "failed",
            message: "User id not provided",
            data: {}
        });
    }else{
        const result = await removeUserAccessFromRoom(user_id, req.user);
        res.status(result.statusCode).json(result.data);
    }

};
