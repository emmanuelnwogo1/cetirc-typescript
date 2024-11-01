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
