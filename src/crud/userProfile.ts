import { Router } from 'express';
import { UserProfile } from '../models/UserProfile';
import verifyToken from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';
import { Op } from 'sequelize';
import { User } from '../models/User';

const router = Router();

// Create
router.post('/', verifyToken, adminMiddleware, async (req, res): Promise<any> => {
    try {
        const userProfile = await UserProfile.create(req.body);
        return res.status(201).json({
                status: 'success',
                message: 'UserProfile created successfully',
                data: userProfile,
            });
    } catch (error: any) {
        return res.status(500).json({
            status: 'failed',
            message: 'Failed to create userprofile',
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
    try {
        const pageNumber = parseInt(page as string) || 1;
        const limitNumber = parseInt(limit as string) || 10;
        const offset = (pageNumber - 1) * limitNumber;

        const whereClause = q
            ? {
                [Op.or]: [
                    { '$user.first_name$': { [Op.iLike]: `%${q}%` } },
                    { '$user.last_name$': { [Op.iLike]: `%${q}%` } },
                    { email: { [Op.iLike]: `%${q}%` } },
                ],
            }
            : {};
  
        const { rows: userProfiles, count: totalUserProfiles } = await UserProfile.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['first_name', 'last_name'],
                },
            ],
            offset,
            limit: limitNumber,
        });
  
        const totalPages = Math.ceil(totalUserProfiles / limitNumber);
  
        if (!userProfiles.length) {
            res.status(404).json({
                status: 'failed',
                message: 'No userprofiles found on this page',
                data: {
                    userProfiles: [],
                    pagination: {
                        total: totalUserProfiles,
                        page: pageNumber,
                        limit: limitNumber,
                        totalPages,
                    },
                },
            });
        } else {
            res.json({
                status: 'success',
                message: 'UserProfile retrieved successfully',
                data: {
                    userProfiles,
                    pagination: {
                        total: totalUserProfiles,
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
            message: 'Failed to retrieve userprofiles',
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
        const userProfile = await UserProfile.findByPk(req.params.id);
        if (!userProfile) {
            res.status(404).json({
                status: 'failed',
                message: 'UserProfile not found',
                data: null,
            });
        } else {
            res.json({
                status: 'success',
                message: 'UserProfile retrieved successfully',
                data: userProfile,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to retrieve userprofile',
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
        const [updated] = await UserProfile.update(req.body, {
            where: { id: userId },
        });

        if (updated > 0) {
            const updatedUser = await UserProfile.findByPk(userId);
            res.json({
                status: 'success',
                message: 'UserProfile updated successfully',
                data: updatedUser,
            });
        } else {
            res.status(404).json({
                status: 'failed',
                message: 'UserProfile not found',
                data: null,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to update userprofile',
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
        const deleted = await UserProfile.destroy({
            where: { id: req.params.id },
        });

        if (deleted) {
            res.status(200).json({
                status: 'success',
                message: 'UserProfile deleted successfully',
                data: null,
            });
        } else {
            res.status(404).json({
                status: 'failed',
                message: 'UserProfile not found',
                data: null,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to delete userprofile',
            data: {
                errors: error.errors?.map((err: any) => ({
                    message: err.message,
                })) ?? `Error code: ${error.parent?.code}`,
            },
        });
    }
});

export default router;