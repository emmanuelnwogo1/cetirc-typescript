import { User } from "../../models/User";
import { addSmartLockService, getBusinessSmartLocks, grantSmartLockAccessToBusiness, signUpBusinessSmartLock } from "../../services/business/businessSmartLockService";
import { Request, Response } from 'express';

export const signUpBusinessSmartLockController = async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const { smart_lock, business_type } = req.body;

      if (!smart_lock || !business_type) {
        res.status(400).json({
          status: 'failed',
          message: 'Invalid input.',
          data: {},
        });
      }

      const result = await signUpBusinessSmartLock(userId, smart_lock, business_type);
      res.status(201).json(result);
    } catch (error: any) {
        res.status(400).json({
            status: 'failed',
            message: error.message,
            data: {},
      });
    }
}

export const fetchBusinessSmartLocks = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        const response = await getBusinessSmartLocks(userId);

        res.status(response.status === 'success' ? 200 : 404).json(response);
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'An error occurred while processing your request.',
            data: error.message,
        });
    }
};

export const grantSmartLockAccessToBusinessController = async (req: Request, res: Response) => {
    const { businessType } = req.params;
    const { username, device_id, period, room_id } = req.body;

    try {
        const user = await User.findOne({where: {id: req.user.id}})
        const response = await grantSmartLockAccessToBusiness(
            user,
            username,
            device_id,
            period,
            room_id,
            businessType,
            req.user.id
        );

        const statusCode = response.status === 'success' ? 201 : 400;
        res.status(statusCode).json(response);
    } catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'An error occurred while granting access.',
            data: {}
        });
    }
};

export const addSmartLockController = async (req: Request, res: Response) => {
    try {
        const { device_id, business_type } = req.body;
        const userId = req.user.id;

        const result = await addSmartLockService(device_id, business_type, userId);
        res.status(result.statusCode).json(result.data);
    } catch (error: any) {
        res.status(404).json({
            status: 'failed',
            message: error.message || 'Failed to add smart lock.',
            data: {}
        });
    }
};