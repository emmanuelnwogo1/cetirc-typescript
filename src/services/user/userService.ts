import { UserProfile } from "../../models/UserProfile";

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

        // Update the profile with provided data
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
        // Fetch the user profile based on the authenticated user ID
        const userProfile = await UserProfile.findOne({ where: { id: userId } });

        if (!userProfile) {
            return {
                status: "error",
                message: "User profile does not exist.",
                data: {}
            };
        }

        // Format user profile data for response
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
