import { PasswordResetRequest } from "../../models/PasswordResetRequest";
import { User } from "../../models/User";
import { sendMail } from "../../utils/mail";


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
