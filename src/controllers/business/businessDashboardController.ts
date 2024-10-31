import { Response, Request } from 'express';
import { getBusinessDashboard, updateBusinessDashboard } from '../../services/business/businessDashboardService';

export const businessDashboardController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;

        const dashboardData = await getBusinessDashboard(userId);

        res.status(200).json({
            status: 'success',
            message: 'Operation completed successfully.',
            data: dashboardData,
        });
    } catch (error: any) {
        res.status(error.status || 500).json({
            status: 'failed',
            message: error.message || 'An unexpected error occurred.',
            data: {},
        });
    }
};

export const updateDashboardController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;

        const data = req.body;
        const updatedData = await updateBusinessDashboard(userId, data);

        res.status(200).json({
            status: 'success',
            message: 'Business dashboard updated successfully.',
            data: updatedData,
        });
    } catch (error: any) {
        res.status(error.status || 500).json({
            status: 'failed',
            message: error.message || 'An unexpected error occurred.',
            data: {},
        });
    }
};
