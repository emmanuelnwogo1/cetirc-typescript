import bcrypt from 'bcrypt';
import { BusinessProfile } from '../../models/BusinessProfile';

export const registerBusiness = async (data: any)  => {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const businessProfile = await BusinessProfile.create({
        ...data,
        password: hashedPassword,
    });

    return businessProfile;
};