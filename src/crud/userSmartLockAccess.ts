import { Router } from 'express';
import { UserSmartLockAccess } from '../models/UserSmartLockAccess';
import verifyToken from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';
import { Op } from 'sequelize';
import { SmartLock } from '../models/SmartLock';
import { User } from '../models/User';
import { Room } from '../models/Room';

const router = Router();

// Create
router.post('/', verifyToken, adminMiddleware, async (req, res) => {
    try {
        const userSmartLockAccess = await UserSmartLockAccess.create({
            ...req.body,
        });
        res.status(201).json({
            status: 'success',
            message: 'UserSmartLockAccess created successfully',
            data: userSmartLockAccess,
        });
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to create userSmartLockAccesssmartlockaccess',
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
                    { '$user.first_name$': { [Op.iLike]: `%${q}%` } },
                    { '$user.last_name$': { [Op.iLike]: `%${q}%` } },
                    { '$user.email$': { [Op.iLike]: `%${q}%` } },
                    { '$smartLock.name$': { [Op.iLike]: `%${q}%` } },
                    { '$room.name$': { [Op.iLike]: `%${q}%` } },
                ],
            }
            : {};
  
        const { rows: userSmartLockAccesss, count: totalUserSmartLockAccesss } = await UserSmartLockAccess.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: SmartLock,
                    as: 'smartLock',
                    attributes: ['name']
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['first_name', 'last_name', 'email']
                },
                {
                    model: Room,
                    as: 'room',
                    attributes: ['name']
                }
            ],
            offset,
            limit: limitNumber,
        });
  
        const totalPages = Math.ceil(totalUserSmartLockAccesss / limitNumber);
  
        if (!userSmartLockAccesss.length) {
            res.status(200).json({
                status: 'success',
                message: 'No userSmartLockAccesssmartlockaccesss found on this page',
                data: {
                    userSmartLockAccesss: [],
                    pagination: {
                        total: totalUserSmartLockAccesss,
                        page: pageNumber,
                        limit: limitNumber,
                        totalPages,
                    },
                },
            });
        } else {
            res.json({
                status: 'success',
                message: 'UserSmartLockAccess retrieved successfully',
                data: {
                    userSmartLockAccesss,
                    pagination: {
                        total: totalUserSmartLockAccesss,
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
            message: 'Failed to retrieve userSmartLockAccesssmartlockaccesss',
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
        const userSmartLockAccess = await UserSmartLockAccess.findByPk(req.params.id);
        if (!userSmartLockAccess) {
            res.status(404).json({
                status: 'failed',
                message: 'UserSmartLockAccess not found',
                data: null,
            });
        } else {
            res.json({
                status: 'success',
                message: 'UserSmartLockAccess retrieved successfully',
                data: userSmartLockAccess,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to retrieve userSmartLockAccesssmartlockaccess',
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
        const userSmartLockAccessId = parseFloat(req.params.id);
        const [updated] = await UserSmartLockAccess.update(req.body, {
            where: { id: userSmartLockAccessId },
        });

        if (updated > 0) {
            const updatedUserSmartLockAccess = await UserSmartLockAccess.findByPk(userSmartLockAccessId);
            res.json({
                status: 'success',
                message: 'UserSmartLockAccess updated successfully',
                data: updatedUserSmartLockAccess,
            });
        } else {
            res.status(404).json({
                status: 'failed',
                message: 'UserSmartLockAccess not found',
                data: null,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to update userSmartLockAccesssmartlockaccess',
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
        const deleted = await UserSmartLockAccess.destroy({
            where: { id: req.params.id },
        });

        if (deleted) {
            res.status(200).json({
                status: 'success',
                message: 'UserSmartLockAccess deleted successfully',
                data: null,
            });
        } else {
            res.status(404).json({
                status: 'failed',
                message: 'UserSmartLockAccess not found',
                data: null,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to delete userSmartLockAccesssmartlockaccess',
            data: {
                errors: error.errors?.map((err: any) => ({
                    message: err.message,
                })) ?? `Error code: ${error.parent?.code}`,
            },
        });
    }
});

export default router;