import { Router } from 'express';
import { User } from '../models/User';
import verifyToken from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt';
import { BusinessProfile } from '../models/BusinessProfile';
import { BusinessDashboard } from '../models/BusinessDashboard';
import { UserProfile } from '../models/UserProfile';

const router = Router();

// Create
router.post('/', verifyToken, adminMiddleware, async (req, res): Promise<any> => {

    const requiredFields: any = User.getAttributes();
    const missingFields = Object.keys(requiredFields)
        .filter((field) => requiredFields[field].allowNull === false && !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json({
            status: 'failed',
            message: 'Validation error',
            data: {
                errors: missingFields.map(field => ({
                    message: `${field} is required`
                }))
            },
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = await User.create({
            ...req.body,
            password: hashedPassword,
        });
        res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            data: user,
        });
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to create user',
            data: {
                errors: error.errors?.map((err: any) => ({
                    message: err.message,
                })) ?? `Error code: ${error.parent?.code}`,
            },
        });
    }
});

// Read all with optional search
router.get('/', verifyToken, adminMiddleware, async (req, res): Promise<any> => {
    const { q, page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page as string) || 1;
    const limitNumber = parseInt(limit as string) || 10;
    const offset = (pageNumber - 1) * limitNumber;

    const whereClause = q
        ? {
            [Op.or]: [
                { username: { [Op.iLike]: `%${q}%` } },
                { email: { [Op.iLike]: `%${q}%` } },
                { first_name: { [Op.iLike]: `%${q}%` } },
                { last_name: { [Op.iLike]: `%${q}%` } },
            ],
        }
        : {};

    try {
        const { rows: users, count: totalUsers } = await User.findAndCountAll({
            where: whereClause,
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: UserProfile,
                    attributes: ['image'],
                }
            ],
            offset,
            limit: limitNumber,
        });

        const serverUrl = process.env.SERVER_URL;
        const defaultImageUrl = process.env.PLACEHOLDER_IMAGE;

        const usersWithFullImageUrl = users.map(user => {
            const imageUrl = user.userProfile?.image
                ? `${serverUrl}/api/${user.userProfile.image}`
                : defaultImageUrl;
            return {
                ...user.toJSON(),
                userProfile: {
                    ...user.userProfile,
                    image: imageUrl,
                },
            };
        });

        const totalPages = Math.ceil(totalUsers / limitNumber);

        if (!usersWithFullImageUrl.length) {
            return res.status(200).json({
                status: 'success',
                message: 'No users found on this page',
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
        }

        return res.json({
            status: 'success',
            message: 'Users retrieved successfully',
            data: {
                users: usersWithFullImageUrl,
                pagination: {
                    total: totalUsers,
                    page: pageNumber,
                    limit: limitNumber,
                    totalPages,
                },
            },
        });
    } catch (error: any) {
        return res.status(500).json({
            status: 'failed',
            message: 'Failed to retrieve users',
            data: {
                errors: error.errors?.map((err: any) => ({
                    message: err.message,
                })) ?? `Error code: ${error.parent?.code}`,
            },
        });
    }
});


router.get('/:id', verifyToken, adminMiddleware, async (req, res): Promise<any> => {
    try {
        const serverUrl = process.env.SERVER_URL;
        const defaultImageUrl = `${process.env.PLACEHOLDER_IMAGE}`;

        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: UserProfile,
                    attributes: ['image'],
                }
            ]
        });

        if (!user) {
            return res.status(404).json({
                status: 'failed',
                message: 'User not found',
                data: null,
            });
        }

        if (user?.userProfile) {
            user.userProfile.image = user.userProfile.image
              ? `${serverUrl}/api/${user.userProfile.image}`
              : defaultImageUrl;
        }

        return res.json({
            status: 'success',
            message: 'User retrieved successfully',
            data: user,
        });
    } catch (error: any) {
        return res.status(500).json({
            status: 'failed',
            message: 'Failed to retrieve user',
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
        const updateData = { ...req.body };

        if (req.body.password) {

            updateData.password = await bcrypt.hash(req.body.password, 10);
        }

        const [updated] = await User.update(updateData, {
            where: { id: userId },
        });

        if (updated > 0) {

            const updatedUser = await User.findByPk(userId, {
                attributes: { exclude: ['password'] },
            });

            res.json({
                status: 'success',
                message: 'User updated successfully',
                data: updatedUser,
            });
        } else {
            res.status(404).json({
                status: 'failed',
                message: 'User not found',
                data: null,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to update user',
            data: {
                errors: error.errors?.map((err: any) => ({
                    message: err.message,
                })) ?? `Error code: ${error.parent?.code}`,
            },
        });
    }
});

// Delete
router.delete('/:id', verifyToken, adminMiddleware, async (req, res): Promise<any> => {
    try {

        const businessProfile = await BusinessProfile.findOne({
            where: {
                user_id: req.params.id
            }
        })

        const userProfile = await UserProfile.findOne({
            where: {
                username_id: req.params.id
            }
        })

        if(businessProfile){

            const businessDashboard = await BusinessDashboard.findOne({
                where: {
                    business_id: businessProfile.id
                }
            })

            if(businessDashboard){
                businessDashboard.destroy();
            }

            businessProfile.destroy();
        }

        if(userProfile){
            userProfile.destroy();
        }

        const deleted = await User.destroy({
            where: { id: req.params.id },
        });

        if (deleted) {
            return res.status(200).json({
                status: 'success',
                message: 'User deleted successfully',
                data: null,
            });
        } else {
            return res.status(404).json({
                status: 'failed',
                message: 'User not found',
                data: null,
            });
        }
    } catch (error: any) {
        return res.status(500).json({
            status: 'failed',
            message: 'Failed to delete user',
            data: {
                errors: error.errors?.map((err: any) => ({
                    message: err.message,
                })) ?? `Error code: ${error.parent?.detail}`,
            },
        });
    }
});

export default router;