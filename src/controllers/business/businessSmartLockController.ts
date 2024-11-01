import { signUpBusinessSmartLock } from "../../services/business/businessSmartLockService";
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