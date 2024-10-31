import { Op } from "sequelize";
import { PasswordResetRequest } from "../../models/PasswordResetRequest";
import { User } from "../../models/User";
import { sendMail } from "../../utils/mail";
import bcrypt from 'bcrypt';


export const requestPasswordReset = async (email: string) => {
    const user = await User.findOne({ where: { email } });

    if (!user) {
        return {
            status: 'failed',
            message: 'Email not found.',
            data: {}
        };
    }

    // Generate PIN
    const pin = Math.random().toString().slice(-6);
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    await PasswordResetRequest.create({
        user_id: user.id,
        pin: pin,
        expires_at: expiresAt,
        created_at: new Date()
    } as PasswordResetRequest);

    // Send PIN via email
    //await sendMail(email, 'Password Reset PIN', `Your PIN for password reset is ${pin}. It expires in 10 minutes.`);

    return {
        status: 'success',
        message: 'PIN sent to your email.',
        data: {}
    };
};

export const verifyPin = async (email: string, pin: string, newPassword: string): Promise<{ status: string, message: string }> => {
    
    email = email.trim().toLowerCase();

    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new Error('Email not found.');
    }

    const resetRequest = await PasswordResetRequest.findOne({
        where: {
            user_id: user.id,
            pin,
            expires_at: { [Op.gt]: new Date() }
        }
    });

    if (!resetRequest) {
        throw new Error('Invalid PIN or PIN has expired.');
    }

    if (newPassword.length < 8) {
        throw new Error('Password must be at least 8 characters.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });
    
    await resetRequest.destroy();

    return {
        status: 'success',
        message: 'Password reset successfully.'
    };
}
