import { Router } from 'express';
import { Permission } from '../models/Permission';
import verifyToken from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';
import { Op } from 'sequelize';

const router = Router();

// Create
router.post('/', verifyToken, adminMiddleware, async (req, res) => {
    try {
        const permission = await Permission.create(req.body);
        res.status(201).json({
            status: 'success',
            message: 'Permission created successfully',
            data: permission,
        });
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to create permission',
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
                name: { [Op.iLike]: `%${q}%` },
            }
            : {};
  
        const { rows: permissions, count: totalPermissions } = await Permission.findAndCountAll({
            where: whereClause,
            offset,
            limit: limitNumber,
        });
  
        const totalPages = Math.ceil(totalPermissions / limitNumber);
  
        if (!permissions.length) {
            res.status(200).json({
                status: 'success',
                message: 'No permissions found on this page',
                data: {
                    permissions: [],
                    pagination: {
                        total: totalPermissions,
                        page: pageNumber,
                        limit: limitNumber,
                        totalPages,
                    },
                },
            });
        } else {
            res.json({
                status: 'success',
                message: 'Permission retrieved successfully',
                data: {
                    permissions,
                    pagination: {
                        total: totalPermissions,
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
            message: 'Failed to retrieve permissions',
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
        const permission = await Permission.findByPk(req.params.id);
        if (!permission) {
            res.status(404).json({
                status: 'failed',
                message: 'Permission not found',
                data: null,
            });
        } else {
            res.json({
                status: 'success',
                message: 'Permission retrieved successfully',
                data: permission,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to retrieve permission',
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
        const permissionId = parseFloat(req.params.id);
        const [updated] = await Permission.update(req.body, {
            where: { id: permissionId },
        });

        if (updated > 0) {
            const updatedPermission = await Permission.findByPk(permissionId);
            res.json({
                status: 'success',
                message: 'Permission updated successfully',
                data: updatedPermission,
            });
        } else {
            res.status(404).json({
                status: 'failed',
                message: 'Permission not found',
                data: null,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to update permission',
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
        const deleted = await Permission.destroy({
            where: { id: req.params.id },
        });

        if (deleted) {
            res.status(200).json({
                status: 'success',
                message: 'Permission deleted successfully',
                data: null,
            });
        } else {
            res.status(404).json({
                status: 'failed',
                message: 'Permission not found',
                data: null,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to delete permission',
            data: {
                errors: error.errors?.map((err: any) => ({
                    message: err.message,
                })) ?? `Error code: ${error.parent?.code}`,
            },
        });
    }
});

export default router;