import { Request, Response } from 'express';
import userSmartLockService from '../../../services/user/smartlock/userSmartLockService';

class UserSmartLockController {
    
    async userSmartLockSignUp(req: Request, res: Response) {
        const { device_id, group_name } = req.body;
        const userId = req.user.id;

        try {
            const response = await userSmartLockService.userSmartLockSignUp(device_id, group_name, userId);
            res.status(201).json(response);
        } catch (error: any) {
            res.status(404).json({
                status: 'failed',
                message: 'Invalid input.',
                data: {
                    non_field_errors: [error.message]
                }
            });
        }
    }
}

export default new UserSmartLockController();
