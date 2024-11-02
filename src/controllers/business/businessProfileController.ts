import { Request, Response } from 'express';
import { getBusinessProfileDetails } from '../../services/business/businessProfileService';
import { updateBusinessProfileImage } from '../../services/business/businessService';

export const fetchBusinessProfileDetails = async (req: Request, res: Response) => {
    const userId = req.user.id;

    const result = await getBusinessProfileDetails(userId);

    if (result.status === "success") {
        res.status(200).json(result);
    } else if (result.message === "Business profile does not exist.") {
        res.status(404).json(result);
    } else {
        res.status(500).json(result);
    }
};

export const updateBusinessProfileImageController = async (req: Request, res: Response) => {
    const userId = req.user.id;
    const image = req.file;

    if (!image) {
        res.status(400).json({
            status: 'failed',
            message: 'No image file uploaded.',
        });
        return;
    }

    const result = await updateBusinessProfileImage(userId, image);

    res.json(result);
};
