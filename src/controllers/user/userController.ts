import { Request, Response } from 'express';
import { getUserProfileDetails, updateUserProfile, updateUserProfilePhoto } from '../../services/user/userService';
import { MulterError } from 'multer';

export const editUserProfile = async (req: Request, res: Response) => {
    const userId = req.user.id;
    const data = req.body;

    const result = await updateUserProfile(userId, data);

    if (result.status === "success") {
        res.status(200).json(result);
    } else if (result.status === "failed") {
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
    } else if (result.status === "failed") {
        res.status(404).json(result);
    } else {
        res.status(500).json(result);
    }
};

export const updateProfilePhotoController = async (req: Request, res: Response) => {
    const userId = req.user.id;

    try {
        const image = req.file;

        if (!image) {
            res.status(400).json({
                status: 'failed',
                message: 'No image file uploaded.',
            });
        }else{
            const result = await updateUserProfilePhoto(userId, image);

            if (result.status === 'failed') {
                res.status(400).json(result);
            } else {
                res.status(200).json(result);
            }
        }
    } catch (error: any) {
        res.status(400).json({
            status: 'failed',
            message: error.message,
        });
    }
};


