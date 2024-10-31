import { Request, Response } from 'express';
import { requestPasswordReset, verifyPin } from '../../services/password/passwordResetService';

export const requestPasswordResetController = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
        const result = await requestPasswordReset(email);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'An error occurred while processing your request.',
            data: {}
        });
    }
};

export const confirmPasswordReset = async (req: Request, res: Response): Promise<void> => {
    const { email, pin, new_password, confirm_password } = req.body;

    if (new_password !== confirm_password) {
        res.status(400).json({
            status: 'failed',
            message: 'Passwords do not match.',
            data: {}
        });
    }

    try {
        const result = await verifyPin(email, pin, new_password);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({
            status: 'failed',
            message: error.message,
            data: {}
        });
    }
}
