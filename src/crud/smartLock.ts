import { Router } from 'express';
import { SmartLock } from '../models/SmartLock';
import verifyToken from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';
import { Op } from 'sequelize';
import { SmartLockGroup } from '../models/SmartLockGroup';
import { Room } from '../models/Room';

const router = Router();

// Create
router.post('/', verifyToken, adminMiddleware, async (req, res) => {
    try {
        const smartLock = await SmartLock.create({
            ...req.body,
        });
        res.status(201).json({
            status: 'success',
            message: 'SmartLock created successfully',
            data: smartLock,
        });
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to create smartlock',
            data: {
                errors: error.errors?.map((err: any) => ({
                    message: err.message,
                })) ?? `Error code: ${error.parent?.detail}`,
            },
        });
    }
});

// Read all with optional search
router.get('/', verifyToken, adminMiddleware, async (req, res) => {
    const { q, page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page as string) || 1;
    const limitNumber = parseInt(limit as string) || 10;
    const offset = (pageNumber - 1) * limitNumber;

    const whereClause = q
        ? {
            [Op.or]: [
                { name: { [Op.iLike]: `%${q}%` } },
                {
                    '$smartLockGroup.name$': { [Op.iLike]: `%${q}%` },
                },
                {
                    '$room.name$': { [Op.iLike]: `%${q}%` },
                },
            ],
        }
        : {};

    try {
        const { rows: smartLocks, count: totalSmartLocks } = await SmartLock.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: SmartLockGroup,
                    as: 'smartLockGroup',
                    required: false,
                    attributes: ['name'],
                },
                {
                    model: Room,
                    as: 'room',
                    required: false,
                    attributes: ['name'],
                },
            ],
            offset,
            limit: limitNumber,
        });

        const totalPages = Math.ceil(totalSmartLocks / limitNumber);

        if (!smartLocks.length) {
            res.status(200).json({
                status: 'success',
                message: 'No smart locks found on this page',
                data: {
                    smartLocks: [],
                    pagination: {
                        total: totalSmartLocks,
                        page: pageNumber,
                        limit: limitNumber,
                        totalPages,
                    },
                },
            });
        } else {
            res.json({
                status: 'success',
                message: 'SmartLocks retrieved successfully',
                data: {
                    smartLocks,
                    pagination: {
                        total: totalSmartLocks,
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
            message: 'Failed to retrieve smart locks',
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
        const smartLock = await SmartLock.findByPk(req.params.id);
        if (!smartLock) {
            res.status(404).json({
                status: 'failed',
                message: 'SmartLock not found',
                data: null,
            });
        } else {
            res.json({
                status: 'success',
                message: 'SmartLock retrieved successfully',
                data: smartLock,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to retrieve smartlock',
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
        const smartLockId = parseFloat(req.params.id);
        const [updated] = await SmartLock.update(req.body, {
            where: { id: smartLockId },
        });

        if (updated > 0) {
            const updatedSmartLock = await SmartLock.findByPk(smartLockId);
            res.json({
                status: 'success',
                message: 'SmartLock updated successfully',
                data: updatedSmartLock,
            });
        } else {
            res.status(404).json({
                status: 'failed',
                message: 'SmartLock not found',
                data: null,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to update smartlock',
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
        const deleted = await SmartLock.destroy({
            where: { id: req.params.id },
        });

        if (deleted) {
            res.status(200).json({
                status: 'success',
                message: 'SmartLock deleted successfully',
                data: null,
            });
        } else {
            res.status(404).json({
                status: 'failed',
                message: 'SmartLock not found',
                data: null,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to delete smartlock',
            data: {
                errors: error.errors?.map((err: any) => ({
                    message: err.message,
                })) ?? `Error code: ${error.parent?.code}`,
            },
        });
    }
});

export default router;