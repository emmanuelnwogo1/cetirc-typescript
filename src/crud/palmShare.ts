import { Router } from 'express';
import { PalmShare } from '../models/PalmShare';
import verifyToken from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';
import { Op } from 'sequelize';
import { User } from '../models/User';

const router = Router();

// Create
router.post('/', verifyToken, adminMiddleware, async (req, res) => {
    try {
        const palmShare = await PalmShare.create({
            ...req.body,
        });
        res.status(201).json({
            status: 'success',
            message: 'PalmShare created successfully',
            data: palmShare,
        });
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to create palmshare',
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
                    { '$owner.first_name$': { [Op.iLike]: `%${q}%` } },
                    { '$owner.last_name$': { [Op.iLike]: `%${q}%` } },
                    { '$owner.email$': { [Op.iLike]: `%${q}%` } },
                    { '$allowedUser.first_name$': { [Op.iLike]: `%${q}%` } },
                    { '$allowedUser.last_name$': { [Op.iLike]: `%${q}%` } },
                    { '$allowedUser.email$': { [Op.iLike]: `%${q}%` } },
                ],
            }
            : {};

        const { rows: palmShares, count: totalPalmShares } = await PalmShare.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: User,
                    as: 'owner',
                    attributes: ['first_name', 'last_name', 'email'],
                },
                {
                    model: User,
                    as: 'allowedUser',
                    attributes: ['first_name', 'last_name', 'email'],
                },
            ],
            offset,
            limit: limitNumber,
        });

        const totalPages = Math.ceil(totalPalmShares / limitNumber);

        if (!palmShares.length) {
            res.status(200).json({
                status: 'success',
                message: 'No palmshares found on this page',
                data: {
                    palmShares: [],
                    pagination: {
                        total: totalPalmShares,
                        page: pageNumber,
                        limit: limitNumber,
                        totalPages,
                    },
                },
            });
        } else {
            res.json({
                status: 'success',
                message: 'PalmShare retrieved successfully',
                data: {
                    palmShares,
                    pagination: {
                        total: totalPalmShares,
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
            message: 'Failed to retrieve palmshares',
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
        const palmShare = await PalmShare.findByPk(req.params.id);
        if (!palmShare) {
            res.status(404).json({
                status: 'failed',
                message: 'PalmShare not found',
                data: null,
            });
        } else {
            res.json({
                status: 'success',
                message: 'PalmShare retrieved successfully',
                data: palmShare,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to retrieve palmshare',
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
        const palmShareId = parseFloat(req.params.id);
        const [updated] = await PalmShare.update(req.body, {
            where: { id: palmShareId },
        });

        if (updated > 0) {
            const updatedUser = await PalmShare.findByPk(palmShareId);
            res.json({
                status: 'success',
                message: 'PalmShare updated successfully',
                data: updatedUser,
            });
        } else {
            res.status(404).json({
                status: 'failed',
                message: 'PalmShare not found',
                data: null,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to update palmshare',
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
        const deleted = await PalmShare.destroy({
            where: { id: req.params.id },
        });

        if (deleted) {
            res.status(200).json({
                status: 'success',
                message: 'PalmShare deleted successfully',
                data: null,
            });
        } else {
            res.status(404).json({
                status: 'failed',
                message: 'PalmShare not found',
                data: null,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to delete palmshare',
            data: {
                errors: error.errors?.map((err: any) => ({
                    message: err.message,
                })) ?? `Error code: ${error.parent?.code}`,
            },
        });
    }
});

export default router;