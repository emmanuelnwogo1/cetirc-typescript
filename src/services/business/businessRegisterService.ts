import bcrypt from 'bcrypt';
import { BusinessProfile } from '../../models/BusinessProfile';
import { Conflict, NotFound } from 'http-errors';

export const registerBusiness = async (data: any) => {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    try {
        const businessProfile = await BusinessProfile.create({
            ...data,
            password: hashedPassword,
        });

        if (!businessProfile) {
            throw new NotFound('Failed to register business.');
        }

        return businessProfile;
    } catch (error: any) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Conflict('Email already exists. Please use a different email.');
        }
        throw error;
    }
};