import { Request, Response } from 'express';
import { getPalmShareMembers, savePalmShareSettings } from '../services/palmShareService';
import { User } from '../models/User';

export const palmShareController = async (req: Request, res: Response) => {
    const { allowed_username, max_amount } = req.body;
    const ownerId = req.user.id;

    if (!allowed_username || max_amount === undefined) {
        res.status(400).json({
            status: 'failed',
            message: 'Invalid input.',
            data: {}
        });
    }

    try {
        const result = await savePalmShareSettings(ownerId, allowed_username, max_amount);
        
        if (result.status === 'failed') {
            res.status(404).json(result);
        }

        res.status(201).json(result);
    } catch (error: any) {
        console.error("Error saving palm share settings:", error);
        res.status(500).json({
            status: 'failed',
            message: error.message,
            data: {}
        });
    }
};

export const palmShareMemmebersController = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne(req.user.id);
        const members = await getPalmShareMembers(user.username);
        
        res.status(200).json({
            status: 'success',
            message: 'PalmShare members retrieved successfully.',
            data: members
        });
    } catch (error: any) {
        res.status(404).json({
            status: 'failed',
            message: error.message,
            data: {}
        });
    }
}