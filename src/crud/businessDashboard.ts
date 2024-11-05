import { Router } from 'express';
import { BusinessDashboard } from '../models/BusinessDashboard';
import verifyToken from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt';

const router = Router();

// Create
router.post('/', verifyToken, adminMiddleware, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const businessDashboard = await BusinessDashboard.create({
            ...req.body,
            password: hashedPassword,
        });
        res.status(201).json({
            status: 'success',
            message: 'BusinessDashboard created successfully',
            data: businessDashboard,
        });
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to create businessdashboard',
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
                    { businessDashboardname: { [Op.iLike]: `%${q}%` } },
                    { email: { [Op.iLike]: `%${q}%` } },
                    { first_name: { [Op.iLike]: `%${q}%` } },
                    { last_name: { [Op.iLike]: `%${q}%` } },
                ],
            }
            : {};
  
        const { rows: businessDashboards, count: totalBusinessDashboards } = await BusinessDashboard.findAndCountAll({
            where: whereClause,
            offset,
            limit: limitNumber,
        });
  
        const totalPages = Math.ceil(totalBusinessDashboards / limitNumber);
  
        if (!businessDashboards.length) {
            res.status(404).json({
                status: 'failed',
                message: 'No businessdashboards found on this page',
                data: {
                    businessDashboards: [],
                    pagination: {
                        total: totalBusinessDashboards,
                        page: pageNumber,
                        limit: limitNumber,
                        totalPages,
                    },
                },
            });
        } else {
            res.json({
                status: 'success',
                message: 'BusinessDashboard retrieved successfully',
                data: {
                    businessDashboards,
                    pagination: {
                        total: totalBusinessDashboards,
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
            message: 'Failed to retrieve businessdashboards',
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
        const businessDashboard = await BusinessDashboard.findByPk(req.params.id);
        if (!businessDashboard) {
            res.status(404).json({
                status: 'failed',
                message: 'BusinessDashboard not found',
                data: null,
            });
        } else {
            res.json({
                status: 'success',
                message: 'BusinessDashboard retrieved successfully',
                data: businessDashboard,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to retrieve businessdashboard',
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
        const businessDashboardId = parseFloat(req.params.id);
        const [updated] = await BusinessDashboard.update(req.body, {
            where: { id: businessDashboardId },
        });

        if (updated > 0) {
            const updatedBusinessDashboard = await BusinessDashboard.findByPk(businessDashboardId);
            res.json({
                status: 'success',
                message: 'BusinessDashboard updated successfully',
                data: updatedBusinessDashboard,
            });
        } else {
            res.status(404).json({
                status: 'failed',
                message: 'BusinessDashboard not found',
                data: null,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to update businessdashboard',
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
        const deleted = await BusinessDashboard.destroy({
            where: { id: req.params.id },
        });

        if (deleted) {
            res.status(200).json({
                status: 'success',
                message: 'BusinessDashboard deleted successfully',
                data: null,
            });
        } else {
            res.status(404).json({
                status: 'failed',
                message: 'BusinessDashboard not found',
                data: null,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to delete businessdashboard',
            data: {
                errors: error.errors?.map((err: any) => ({
                    message: err.message,
                })) ?? `Error code: ${error.parent?.code}`,
            },
        });
    }
});

export default router;