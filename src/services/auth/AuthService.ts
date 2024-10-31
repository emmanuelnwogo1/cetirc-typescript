import { User } from '../../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export class AuthService {
  async loginUser(email: string, password: string) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '1h' }
    );

    return {
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          userId: user.id,
          username: user.username,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber || 'Not Provided',
          userType: user.userType || 'personal',
          profilePicture: user.profilePicture,
          token,
          roles: ['user'],
          preferences: {
            language: user.language || 'en',
            notifications: {
              email: user.notificationEmail || false,
              sms: user.notificationSms || false,
            },
          },
        },
      },
    };
  }
}
