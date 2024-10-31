import { Request, Response } from 'express';
import { requestPasswordReset } from '../../services/password/passwordResetService';

export const requestPasswordResetController = async (req: Request, res: Response) => {
    const { email } = req.body;

    //try {
        const result = await requestPasswordReset(email);
        res.status(200).json(result);
    // } catch (error) {
    //     res.status(500).json({
    //         status: 'failed',
    //         message: 'An error occurred while processing your request.',
    //         data: {}
    //     });
    // }
};
