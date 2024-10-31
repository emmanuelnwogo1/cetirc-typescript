import { Request, Response } from 'express';
import { savePalmShareSettings } from '../services/palmShareService';

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
