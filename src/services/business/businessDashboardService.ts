import { BusinessDashboard } from '../../models/BusinessDashboard';
import { BusinessProfile } from '../../models/BusinessProfile';
import { NotFound } from 'http-errors';

export const getBusinessDashboard = async (userId: string|number) => {
    const businessProfile = await BusinessProfile.findOne({ where: { user_id: userId } });

    if (!businessProfile) {
        throw new NotFound('BusinessProfile does not exist');
    }

    const dashboardData = await BusinessDashboard.findOne({ where: { business_id: businessProfile.id } });

    if (!dashboardData) {
        throw new NotFound('BusinessDashboard does not exist');
    }

    return dashboardData;
};

export const updateBusinessDashboard = async (userId: string|number, data: any) => {
    const businessProfile = await BusinessProfile.findOne({ where: { user_id: userId } });

    if (!businessProfile) {
        throw new NotFound('BusinessProfile does not exist');
    }

    const [dashboardData] = await BusinessDashboard.upsert({
        ...data,
        businessId: businessProfile.id,
    });

    return dashboardData;
};
