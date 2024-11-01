import { Request, Response } from 'express';
import userSmartLockService from '../../../services/user/smartlock/userSmartLockService';
import { controlSmartLock } from '../../../services/user/smartlock/smartLockControlService';
import { getUserSmartLockGroups, leaveSmartLockGroup } from '../../../services/user/smartlock/userSmartLockGroupService';

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

    async getUserSmartLockGroupsController(req: Request, res: Response) {
        const userId = req.user.id;
    
        try {
          const result = await getUserSmartLockGroups(userId);
          res.status(200).json(result);
        } catch (error) {
          res.status(500).json({
            status: 'failed',
            message: 'An error occurred while retrieving smart locks.',
            data: {},
          });
        }
    }

    async removeUserFromSmartLockGroup(req: Request, res: Response) {
        const { user_id, smart_lock_device_id } = req.body;
    
        try {
          const result = await userSmartLockService.removeUserFromSmartLockGroup(user_id, smart_lock_device_id);
          res.status(200).json(result);
        } catch (error: any) {
          res.status(400).json({
            status: 'failed',
            message: error.message,
            data: {},
          });
        }
    }

    leaveSmartLockGroupController = async (req: Request, res: Response) => {
        try {
            const userId = req.user.id;
            const { smart_lock_device_id } = req.body;
    
            const response = await leaveSmartLockGroup(userId, smart_lock_device_id);
    
            res.status(response.status === 'success' ? 200 : 404).json(response);
        } catch (error: any) {
            res.status(500).json({
                status: 'failed',
                message: 'An error occurred while processing your request.',
                data: error.message,
            });
        }
    };
}

export default new UserSmartLockController();
