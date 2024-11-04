import { Router } from 'express';
import { Room } from '../models/Room';
import verifyToken from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt';

const router = Router();

// Create
router.post('/', verifyToken, adminMiddleware, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = await Room.create({
            ...req.body,
            password: hashedPassword,
        });
        res.status(201).json({
            status: 'success',
            message: 'Room created successfully',
            data: user,
        });
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to create room',
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
                    { username: { [Op.like]: `%${q}%` } },
                    { email: { [Op.like]: `%${q}%` } },
                    { first_name: { [Op.like]: `%${q}%` } },
                    { last_name: { [Op.like]: `%${q}%` } },
                ],
            }
            : {};
  
        const { rows: users, count: totalUsers } = await Room.findAndCountAll({
            where: whereClause,
            offset,
            limit: limitNumber,
        });
  
        const totalPages = Math.ceil(totalUsers / limitNumber);
  
        if (!users.length) {
            res.status(404).json({
                status: 'failed',
                message: 'No rooms found on this page',
                data: {
                    users: [],
                    pagination: {
                        total: totalUsers,
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
                    users,
                    pagination: {
                        total: totalUsers,
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
        const user = await Room.findByPk(req.params.id);
        if (!user) {
            res.status(404).json({
                status: 'failed',
                message: 'Room not found',
                data: null,
            });
        } else {
            res.json({
                status: 'success',
                message: 'Room retrieved successfully',
                data: user,
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
        const userId = parseFloat(req.params.id);
        const [updated] = await Room.update(req.body, {
            where: { id: userId },
        });

        if (updated > 0) {
            const updatedUser = await Room.findByPk(userId);
            res.json({
                status: 'success',
                message: 'Room updated successfully',
                data: updatedUser,
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
        const deleted = await Room.destroy({
            where: { id: req.params.id },
        });

        if (deleted) {
            res.status(200).json({
                status: 'success',
                message: 'Room deleted successfully',
                data: null,
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
            message: 'Failed to delete room',
            data: {
                errors: error.errors?.map((err: any) => ({
                    message: err.message,
                })) ?? `Error code: ${error.parent?.code}`,
            },
        });
    }
});

export default router;