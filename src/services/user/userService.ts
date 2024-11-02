import { UserProfile } from "../../models/UserProfile";
import { User } from "../../models/User";
import path from "path";
import fs from 'fs';

export const updateUserProfile = async (userId: number, data: any) => {
    try {
        const userProfile = await UserProfile.findOne({ where: { id: userId } });

        if (!userProfile) {
            return {
                status: "failed",
                message: "User profile does not exist.",
                data: {}
            };
        }

        await userProfile.update(data);
        return {
            status: "success",
            message: "User profile updated successfully.",
            data: userProfile
        };
    } catch (error) {
        return {
            status: "failed",
            message: "Failed to update user profile.",
            data: error
        };
    }
};

export const getUserProfileDetails = async (userId: number) => {
    try {
        
        const userProfile = await UserProfile.findOne({ where: { id: userId } });

        if (!userProfile) {
            return {
                status: "error",
                message: "User profile does not exist.",
                data: {}
            };
        }

        const profileData = {
            user_id: userProfile.id,
            username: userProfile.username_id,
            email: userProfile.email,
            image: userProfile.image ? `${userProfile.image}` : null,
            device_id: userProfile.device_id,
            business_associated: userProfile.business_associated
        };

        return {
            status: "success",
            message: "User profile details retrieved successfully.",
            data: profileData
        };
    } catch (error) {
        return {
            status: "error",
            message: "Failed to retrieve user profile.",
            data: error
        };
    }
};

export const updateUserProfilePhoto = async (userId: number, image: Express.Multer.File) => {
    try {
        if (!image || !image.path) {
            return {
                status: 'failed',
                message: 'No image file received.',
                data: {},
            };
        }
        console.log(image.path)

        const imageBuffer = await fs.promises.readFile(image.path);

        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            return {
                status: 'failed',
                message: 'Unauthorized.',
                data: {},
            };
        }

        let profile = await UserProfile.findOne({
            where: { username_id: userId },
        });

        if (!profile) {
            profile = await UserProfile.create({
                username_id: user.id,
                email: user.email,
            } as UserProfile);
        }

        const fileExtension = path.extname(image.originalname) || '.png';
        const timestamp = new Date().toISOString().replace(/:/g, '-').slice(0, 19);
        const imageName = `image_${timestamp}${fileExtension}`;
        const imagePath = path.join(__dirname, '../../../images/', imageName);

        console.log(imagePath);

        await fs.promises.writeFile(imagePath, imageBuffer);

        const serverUrl = process.env.SERVER_URL;
        const fullImageUrl = `${serverUrl}/api/images/${imageName}`;

        profile.image = `images/${imageName}`;
        await profile.save();

        return {
            status: 'success',
            message: 'Profile photo updated successfully.',
            data: { image_url: fullImageUrl },
        };
    } catch (error: any) {
        return {
            status: 'failed',
            message: 'An error occurred while updating the profile photo.',
            data: { error: error.message || 'Unknown error' },
        };
    }
};
