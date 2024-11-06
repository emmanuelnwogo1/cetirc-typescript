import { Router } from 'express';
import { SmartLockGroup } from '../models/SmartLockGroup';
import verifyToken from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';
import { Op } from 'sequelize';
import { SmartLock } from '../models/SmartLock';
import { UserSmartLockAccess } from '../models/UserSmartLockAccess';
import { Room } from '../models/Room';

const router = Router();

// Create
router.post('/', verifyToken, adminMiddleware, async (req, res) => {
    try {
        const smartLockGroup = await SmartLockGroup.create({
            ...req.body,
        });
        res.status(201).json({
            status: 'success',
            message: 'SmartLockGroup created successfully',
            data: smartLockGroup,
        });
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to create smart lock group.',
            data: {
                errors: error.errors?.map((err: any) => ({
                    message: err.message,
                })) ?? `Error code: ${error.parent?.code}` ?? error.parent?.detail,
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
                    { name: { [Op.iLike]: `%${q}%` } },
                    { description: { [Op.iLike]: `%${q}%` } },
                ],
            }
            : {};
  
        const { rows: smartLockGroups, count: totalSmartLockGroups } = await SmartLockGroup.findAndCountAll({
            where: whereClause,
            offset,
            limit: limitNumber,
        });
  
        const totalPages = Math.ceil(totalSmartLockGroups / limitNumber);
  
        if (!smartLockGroups.length) {
            res.status(200).json({
                status: 'success',
                message: 'No smartlockgroups found on this page',
                data: {
                    smartLockGroups: [],
                    pagination: {
                        total: totalSmartLockGroups,
                        page: pageNumber,
                        limit: limitNumber,
                        totalPages,
                    },
                },
            });
        } else {
            res.json({
                status: 'success',
                message: 'SmartLockGroup retrieved successfully',
                data: {
                    smartLockGroups,
                    pagination: {
                        total: totalSmartLockGroups,
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
            message: 'Failed to retrieve smartlockgroups',
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
        const smartLockGroup = await SmartLockGroup.findByPk(req.params.id);
        if (!smartLockGroup) {
            res.status(404).json({
                status: 'failed',
                message: 'SmartLockGroup not found',
                data: null,
            });
        } else {
            res.json({
                status: 'success',
                message: 'SmartLockGroup retrieved successfully',
                data: smartLockGroup,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to retrieve smartlockgroup',
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
        const smartLockGroupId = parseFloat(req.params.id);
        const [updated] = await SmartLockGroup.update(req.body, {
            where: { id: smartLockGroupId },
        });

        if (updated > 0) {
            const updatedSmartLockGroup = await SmartLockGroup.findByPk(smartLockGroupId);
            res.json({
                status: 'success',
                message: 'SmartLockGroup updated successfully',
                data: updatedSmartLockGroup,
            });
        } else {
            res.status(404).json({
                status: 'failed',
                message: 'SmartLockGroup not found',
                data: null,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to update smartlockgroup',
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

        const smartLocks = await SmartLock.findAll({
            where: {
                group_id: req.params.id
            }
        });

        if (smartLocks.length > 0) {
            const smartLockIds = smartLocks.map(smartLock => smartLock.id);

            await UserSmartLockAccess.destroy({
                where: {
                    smart_lock_id: {
                        [Op.in]: smartLockIds
                    }
                }
            });

            for (const smartLock of smartLocks) {
                await smartLock.destroy();
            }
        }

        //delete rooms
        await Room.destroy({
            where: {
                group_id: req.params.id
            }
        })

        const deleted = await SmartLockGroup.destroy({
            where: { id: req.params.id },
        });

        if (deleted) {
            res.status(200).json({
                status: 'success',
                message: 'SmartLockGroup deleted successfully',
                data: null,
            });
        } else {
            res.status(404).json({
                status: 'failed',
                message: 'SmartLockGroup not found',
                data: null,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to delete smartlockgroup',
            data: {
                errors: error.errors?.map((err: any) => ({
                    message: err.message,
                })) ?? `Error code: ${error.parent?.detail}`,
            },
        });
    }
});

export default router;