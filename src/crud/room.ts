import { Router } from 'express';
import { Room } from '../models/Room';
import verifyToken from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';
import { Op } from 'sequelize';
import { SmartLockGroup } from '../models/SmartLockGroup';
import { SmartLock } from '../models/SmartLock';
import { BusinessSmartLock } from '../models/BusinessSmartLock';

const router = Router();

// Create
router.post('/', verifyToken, adminMiddleware, async (req, res) => {
    try {
        const room = await Room.create({
            ...req.body,
        });
        res.status(201).json({
            status: 'success',
            message: 'Room created successfully',
            data: room,
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
                    { name: { [Op.iLike]: `%${q}%` } },
                ],
            }
            : {};
  
        const { rows: rooms, count: totalRooms } = await Room.findAndCountAll({
            where: whereClause,
            offset,
            limit: limitNumber,
        });
  
        const totalPages = Math.ceil(totalRooms / limitNumber);
  
        if (!rooms.length) {
            res.status(200).json({
                status: 'success',
                message: 'No rooms found on this page',
                data: {
                    rooms: [],
                    pagination: {
                        total: totalRooms,
                        page: pageNumber,
                        limit: limitNumber,
                        totalPages,
                    },
                },
            });
        } else {
            res.json({
                status: 'success',
                message: 'Room retrieved successfully',
                data: {
                    rooms,
                    pagination: {
                        total: totalRooms,
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
            message: 'Failed to retrieve rooms',
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
        const room = await Room.findByPk(req.params.id);
        if (!room) {
            res.status(404).json({
                status: 'failed',
                message: 'Room not found',
                data: null,
            });
        } else {
            res.json({
                status: 'success',
                message: 'Room retrieved successfully',
                data: room,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to retrieve room',
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
        const roomId = parseFloat(req.params.id);
        const [updated] = await Room.update(req.body, {
            where: { id: roomId },
        });

        if (updated > 0) {
            const updatedRoom = await Room.findByPk(roomId);
            res.json({
                status: 'success',
                message: 'Room updated successfully',
                data: updatedRoom,
            });
        } else {
            res.status(404).json({
                status: 'failed',
                message: 'Room not found',
                data: null,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to update room',
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
        // Step 1: Find the Room by its ID
        const room = await Room.findByPk(req.params.id);

        if (!room) {
            res.status(404).json({
                status: 'failed',
                message: 'Room not found',
                data: null,
            });
        } else {
            const groupId = room.group_id;

            // Step 2: Find associated Smart Lock for the Room
            const smartLock = await SmartLock.findOne({
                where: {
                    room_id: room.id,
                    group_id: groupId
                }
            });

            if (!smartLock) {
                res.status(404).json({
                    status: 'failed',
                    message: 'Smart lock not found for the room',
                    data: null,
                });
            } else {
                // Step 3: Delete related BusinessSmartLock records
                await BusinessSmartLock.destroy({
                    where: { smart_lock_id: smartLock.id }
                });

                // Step 4: Delete the SmartLock itself
                await SmartLock.destroy({
                    where: { id: smartLock.id }
                });

                // Step 5: Delete the SmartLockGroup
                await SmartLockGroup.destroy({
                    where: { id: groupId }
                });

                // Step 6: Delete the Room
                await Room.destroy({
                    where: { id: req.params.id }
                });

                // Final Response
                res.status(200).json({
                    status: 'success',
                    message: 'Room and associated records deleted successfully',
                    data: null,
                });
            }
        }
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to delete room and associated records',
            data: {
                errors: error.errors?.map((err: any) => ({
                    message: err.message,
                })) ?? `Error code: ${error.parent?.detail}`,
            },
        });
    }
});

export default router;