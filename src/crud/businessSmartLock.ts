import { Router } from 'express';
import { BusinessSmartLock } from '../models/BusinessSmartLock';
import verifyToken from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';
import { Op } from 'sequelize';
import { BusinessProfile } from '../models/BusinessProfile';

const router = Router();

// Create
router.post('/', verifyToken, adminMiddleware, async (req, res) => {
    try {
        const user = await BusinessSmartLock.create({
            ...req.body,
        });
        res.status(201).json({
            status: 'success',
            message: 'BusinessSmartLock created successfully',
            data: user,
        });
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to create businesssmartlock',
            data: {
                errors: error.errors?.map((err: any) => ({
                    message: err.message,
                })) ?? `Error: ${error.parent?.detail}`,
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
                name: {
                    [Op.like]: `%${q}%`,
                },
            }
            : {};

        const { rows: businessSmartLocks, count: totalBusinessSmartLocks } = await BusinessSmartLock.findAndCountAll({
            where: {},
            include: [{
                model: BusinessProfile,
                as: 'businessProfile',
                attributes: ['name'],
                required: true,
                where: whereClause,
            }],
            offset,
            limit: limitNumber,
        });

        const totalPages = Math.ceil(totalBusinessSmartLocks / limitNumber);

        if (!businessSmartLocks.length) {
            res.status(404).json({
                status: 'failed',
                message: 'No business smart locks found on this page',
                data: {
                    businessSmartLocks: [],
                    pagination: {
                        total: totalBusinessSmartLocks,
                        page: pageNumber,
                        limit: limitNumber,
                        totalPages,
                    },
                },
            });
        } else {
            res.json({
                status: 'success',
                message: 'Business smart locks retrieved successfully',
                data: {
                    businessSmartLocks,
                    pagination: {
                        total: totalBusinessSmartLocks,
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
                })) ?? `Error code: ${error.parent?.detail}`,
            },
        });
    }
});

// Read one
router.get('/:id', verifyToken, adminMiddleware, async (req, res) => {
    try {
        const user = await BusinessSmartLock.findByPk(req.params.id);
        if (!user) {
            res.status(404).json({
                status: 'failed',
                message: 'BusinessSmartLock not found',
                data: null,
            });
        } else {
            res.json({
                status: 'success',
                message: 'BusinessSmartLock retrieved successfully',
                data: user,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to retrieve businesssmartlock',
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
        const userId = parseFloat(req.params.id);
        const [updated] = await BusinessSmartLock.update(req.body, {
            where: { id: userId },
        });

        if (updated > 0) {
            const updatedUser = await BusinessSmartLock.findByPk(userId);
            res.json({
                status: 'success',
                message: 'BusinessSmartLock updated successfully',
                data: updatedUser,
            });
        } else {
            res.status(404).json({
                status: 'failed',
                message: 'BusinessSmartLock not found',
                data: null,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to update businesssmartlock',
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
        const deleted = await BusinessSmartLock.destroy({
            where: { id: req.params.id },
        });

        if (deleted) {
            res.status(200).json({
                status: 'success',
                message: 'BusinessSmartLock deleted successfully',
                data: null,
            });
        } else {
            res.status(404).json({
                status: 'failed',
                message: 'BusinessSmartLock not found',
                data: null,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to delete businesssmartlock',
            data: {
                errors: error.errors?.map((err: any) => ({
                    message: err.message,
                })) ?? `Error code: ${error.parent?.code}`,
            },
        });
    }
});

export default router;