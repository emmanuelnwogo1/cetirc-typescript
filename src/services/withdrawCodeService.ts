import { BusinessProfile } from "../models/BusinessProfile";

export const getWithdrawCode = async (userId: number) => {
    try {
        
        const businessProfile = await BusinessProfile.findOne({ where: { user_id: userId } });

        if (!businessProfile) {
            return {
                statusCode: 404,
                status: "failed",
                message: "Business profile not found.",
                data: {}
            };
        }

        const withdrawCode = businessProfile.withdraw_code;

        return {
            statusCode: 200,
            status: "success",
            message: "Withdraw code retrieved successfully.",
            data: {
                withdraw_code: withdrawCode
            }
        };
    } catch (error) {
        return {
            statusCode: 500,
            status: "failed",
            message: "An error occurred while retrieving the withdraw code.",
            data: {}
        };
    }
};