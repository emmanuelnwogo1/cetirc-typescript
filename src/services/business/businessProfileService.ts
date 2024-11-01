import { BusinessProfile } from '../../models/BusinessProfile';

export const getBusinessProfileDetails = async (userId: number) => {
    try {
        const businessProfile = await BusinessProfile.findOne({ where: { user_id: userId } });

        if (!businessProfile) {
            return {
                status: "error",
                message: "Business profile does not exist.",
                data: {}
            };
        }

        const businessData = {
            id: businessProfile.id,
            name: businessProfile.name,
            email: businessProfile.email,
            image: businessProfile.image ? `${businessProfile.image}` : null,
            address: businessProfile.address,
            city: businessProfile.city,
            state: businessProfile.state,
            zip_code: businessProfile.zip_code,
            withdraw_code: businessProfile.withdraw_code,
            latitude: businessProfile.latitude,
            longitude: businessProfile.longitude,
            bank_name: businessProfile.bank_name,
            account_name: businessProfile.account_name,
            iban: businessProfile.iban,
            number: businessProfile.number,
            website_url: businessProfile.website_url,
            opening_hours: businessProfile.opening_hours,
            closing_hours: businessProfile.closing_hours
        };

        return {
            status: "success",
            message: "Business profile retrieved successfully.",
            data: businessData
        };
    } catch (error) {
        return {
            status: "error",
            message: "Failed to retrieve business profile.",
            data: error
        };
    }
};
