import { Router } from 'express';
import { UserProfile } from '../models/UserProfile';
import verifyToken from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';
import { Op } from 'sequelize';
import { User } from '../models/User';
import multer from 'multer';
import path from "path";
import fs from 'fs';

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
router.get('/', verifyToken, adminMiddleware, async (req, res): Promise<any> => {
    const { q, page = 1, limit = 10 } = req.query;
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

    try {
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
            return res.status(200).json({
                status: 'success',
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
            const serverUrl = process.env.SERVER_URL;
            const defaultImageUrl = process.env.PLACEHOLDER_IMAGE;

            const users = userProfiles.map(function(userProfile){
                userProfile.image = userProfile.image ? `${serverUrl}/api/${userProfile.image}` : defaultImageUrl;
                return userProfile;
            });

            return res.json({
                status: 'success',
                message: 'UserProfile retrieved successfully',
                data: {
                    userProfiles: users,
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
        return res.status(500).json({
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
router.get('/:id', verifyToken, adminMiddleware, async (req, res): Promise<any> => {
    try {
        var userProfile = await UserProfile.findByPk(req.params.id);
        if (!userProfile) {
            return res.status(404).json({
                status: 'failed',
                message: 'UserProfile not found',
                data: null,
            });
        } else {

            const serverUrl = process.env.SERVER_URL;
            const defaultImageUrl = `${process.env.PLACEHOLDER_IMAGE}`;

            userProfile.image = userProfile.image 
            ? `${serverUrl}/api/${userProfile.image}` 
            : defaultImageUrl;

            return res.json({
                status: 'success',
                message: 'UserProfile retrieved successfully',
                data: userProfile,
            });
        }
    } catch (error: any) {
        return res.status(500).json({
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

const upload = multer({ dest: 'images/' });
router.patch('/:id/image', verifyToken, adminMiddleware, upload.single('image'), async (req, res): Promise<any> => {

    try {
        const image = req.file;
        const userId = parseInt(req.params.id)

        if (!image || !image.path || !userId) {
            return res.status(404).json({
                status: 'failed',
                message: 'No image or user provided.',
                data: null,
            });
        }

        const imageBuffer = await fs.promises.readFile(image.path);

        let profile = await UserProfile.findOne({
            where: { id: userId },
        });

        if (!profile) {
            return res.status(404).json({
                status: 'failed',
                message: 'UserProfile not found',
                data: null,
            });
        }

        const fileExtension = path.extname(image.originalname) || '.png';
        const timestamp = new Date().toISOString().replace(/:/g, '-').slice(0, 19);
        const imageName = `image_${timestamp}${fileExtension}`;
        const imagePath = path.join(__dirname, '../../images/', imageName);

        await fs.promises.writeFile(imagePath, imageBuffer);

        const serverUrl = process.env.SERVER_URL;
        const fullImageUrl = `${serverUrl}/api/images/${imageName}`;

        profile.image = `images/${imageName}`;
        await profile.save();

        return res.status(200).json({
            status: 'success',
            message: 'Profile photo updated successfully.',
            data: { image_url: fullImageUrl },
        });
    } catch (error: any) {
        return res.status(500).json({
            status: 'failed',
            message: 'An error occurred while updating the profile photo.',
            data: { error: error.message || 'Unknown error' },
        });
    }
});

export default router;