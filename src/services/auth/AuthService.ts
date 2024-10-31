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
          fullName: user.first_name! + user.last_name!,
          email: user.email,
          phoneNumber: 'Not Provided',
          userType: 'personal', // TODO make profile picture dynamic
          profilePicture: 'https://cetircstorage.s3.amazonaws.com/profile_images/scaled_1000025451.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA6GBMFUGOQN4ATMD4%2F20241031%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20241031T045614Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=5f3760236199835aaf4fab494fa83159b723003281090b6a87ef90a176642a66',
          token,
          roles: ['user'],
          preferences: {
            language: 'en',
            notifications: {
              email: true,
              sms: false,
            },
          },
        },
      },
    };
  }
}
