import { Request, Response } from 'express';
import { getUserProfileDetails, updateUserProfile } from '../../services/user/userService';

export const editUserProfile = async (req: Request, res: Response) => {
    const userId = req.user.id;
    const data = req.body;

    const result = await updateUserProfile(userId, data);

    if (result.status === "success") {
        res.status(200).json(result);
    } else if (result.message === "User profile does not exist.") {
        res.status(404).json(result);
    } else {
        res.status(400).json(result);
    }
};

export const fetchUserProfileDetails = async (req: Request, res: Response) => {
    const userId = req.user.id;

    const result = await getUserProfileDetails(userId);

    if (result.status === "success") {
        res.status(200).json(result);
    } else if (result.message === "User profile does not exist.") {
        res.status(404).json(result);
    } else {
        res.status(500).json(result);
    }
};