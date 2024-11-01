import { Request, Response } from 'express';
import userSmartLockService from '../../../services/user/smartlock/userSmartLockService';
import { controlSmartLock } from '../../../services/user/smartlock/smartLockControlService';

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

    async controlSmartLock(req: Request, res: Response) {
        const userId = req.user.id;
        const { action, deviceId } = req.params;
    
        try {
          const result = await controlSmartLock(userId, action, deviceId);
          res.status(200).json(result);
        } catch (error: any) {
          const statusCode = error.message.includes('not found') ? 404 : 403;
          res.status(statusCode).json({
            status: 'failed',
            message: error.message,
            data: {},
          });
        }
    }
}

export default new UserSmartLockController();
