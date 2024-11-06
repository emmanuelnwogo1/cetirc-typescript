import { Router } from 'express';
import { PasswordResetRequest } from '../models/PasswordResetRequest';
import verifyToken from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';
import { Op } from 'sequelize';
import { User } from '../models/User';

const router = Router();

// Create
router.post('/', verifyToken, adminMiddleware, async (req, res) => {
    try {

        const passwordResetRequest = await PasswordResetRequest.create({
            ...req.body,
        });
        res.status(201).json({
            status: 'success',
            message: 'PasswordResetRequest created successfully',
            data: passwordResetRequest,
        });
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: error,
            data: {
                errors: error.errors?.map((err: any) => ({
                    message: err.message,
                })) ?? `Error code: ${error.parent?.code}`,
            },
        });
    }
});

// Read all with optional search
router.get('/', verifyToken, adminMiddleware, async (req, res) => {
    const { q, page = 1, limit = 10 } = req.query;
    try {
        const pageNumber = parseInt(page as string) || 1;
        const limitNumber = parseInt(limit as string) || 10;
        const offset = (pageNumber - 1) * limitNumber;

        const whereClause = q
            ? {
                [Op.or]: [
                    { '$user.email$': { [Op.iLike]: `%${q}%` } },
                    { '$user.first_name$': { [Op.iLike]: `%${q}%` } },
                    { '$user.last_name$': { [Op.iLike]: `%${q}%` } },
                ],
            }
            : {};
  
        const { rows: passwordResetRequests, count: totalPasswordResetRequests } = await PasswordResetRequest.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['first_name', 'last_name', 'email'],
                },
            ],
            offset,
            limit: limitNumber,
        });
  
        const totalPages = Math.ceil(totalPasswordResetRequests / limitNumber);
  
        if (!passwordResetRequests.length) {
            res.status(200).json({
                status: 'success',
                message: 'No passwordresetrequests found on this page',
                data: {
                    passwordResetRequests: [],
                    pagination: {
                        total: totalPasswordResetRequests,
                        page: pageNumber,
                        limit: limitNumber,
                        totalPages,
                    },
                },
            });
        } else {
            res.json({
                status: 'success',
                message: 'PasswordResetRequest retrieved successfully',
                data: {
                    passwordResetRequests,
                    pagination: {
                        total: totalPasswordResetRequests,
                        page: pageNumber,
                        limit: limitNumber,
                        totalPages,
                    },
                },
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: error,
            data: {
                errors: error.errors?.map((err: any) => ({
                    message: err.message,
                })) ?? `Error code: ${error.parent?.code}`,
            },
        });
    }
});

// Read one
router.get('/:id', verifyToken, adminMiddleware, async (req, res) => {
    try {
        const passwordResetRequest = await PasswordResetRequest.findByPk(req.params.id);
        if (!passwordResetRequest) {
            res.status(404).json({
                status: 'failed',
                message: 'PasswordResetRequest not found',
                data: null,
            });
        } else {
            res.json({
                status: 'success',
                message: 'PasswordResetRequest retrieved successfully',
                data: passwordResetRequest,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to retrieve passwordresetrequest',
            data: {
                errors: error.errors?.map((err: any) => ({
                    message: err.message,
                })) ?? `Error code: ${error.parent?.code}`,
            },
        });
    }
});

// Update
router.put('/:id', verifyToken, adminMiddleware, async (req, res) => {
    try {
        const passwordResetRequestId = parseFloat(req.params.id);
        const [updated] = await PasswordResetRequest.update(req.body, {
            where: { id: passwordResetRequestId },
        });

        if (updated > 0) {
            const updatedUser = await PasswordResetRequest.findByPk(passwordResetRequestId);
            res.json({
                status: 'success',
                message: 'PasswordResetRequest updated successfully',
                data: updatedUser,
            });
        } else {
            res.status(404).json({
                status: 'failed',
                message: 'PasswordResetRequest not found',
                data: null,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to update passwordresetrequest',
            data: {
                errors: error.errors?.map((err: any) => ({
                    message: err.message,
                })) ?? `Error code: ${error.parent?.code}`,
            },
        });
    }
});

// Delete
router.delete('/:id', verifyToken, adminMiddleware, async (req, res) => {
    try {
        const deleted = await PasswordResetRequest.destroy({
            where: { id: req.params.id },
        });

        if (deleted) {
            res.status(200).json({
                status: 'success',
                message: 'PasswordResetRequest deleted successfully',
                data: null,
            });
        } else {
            res.status(404).json({
                status: 'failed',
                message: 'PasswordResetRequest not found',
                data: null,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to delete passwordresetrequest',
            data: {
                errors: error.errors?.map((err: any) => ({
                    message: err.message,
                })) ?? `Error code: ${error.parent?.code}`,
            },
        });
    }
});

export default router;