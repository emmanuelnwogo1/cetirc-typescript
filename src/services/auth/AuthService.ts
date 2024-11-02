import { User } from '../../models/User';
import jwt from 'jsonwebtoken';
import bcrypt, { compare } from 'bcrypt';
import { Op } from 'sequelize';
import { BusinessProfile } from '../../models/BusinessProfile';

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
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '24h' }
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

  async registerUser(username: string, email: string, password: string, confirmPassword: string) {
        try{

            if (!username || !email || !password || !confirmPassword) {
                return{
                    status: 'failed',
                    message: 'Registration failed.',
                    data: {
                        error: ['All fields are required.']
                    }
                };
            }
    

            if (password !== confirmPassword) {
                return {
                    status: 'failed',
                    message: 'Registration failed.',
                    data: {
                        password: ['Passwords do not match.']
                    }
                };
            }
    
            const existingUser = await User.findOne({
                where: {
                    [Op.or]: [{ username }, { email }]
                }
            });
    
            if (existingUser) {
                return {
                    status: 'failed',
                    message: 'Registration failed.',
                    data: {
                        username: existingUser.username === username ? ['A user with that username already exists.'] : [],
                        email: existingUser.email === email ? ['A user with that email already exists.'] : []
                    }
                };
            }
    
            const hashedPassword = await bcrypt.hash(password, 10);
    
            const newUser = await User.create({
                username,
                email,
                password: hashedPassword,
                is_superuser: false,
                first_name: username,
                last_name: username,
                is_staff: false,
                is_active: false,
                date_joined: new Date()
            } as User);
    
            const accessToken = jwt.sign(
                { userId: newUser.id },
                process.env.JWT_SECRET || 'default_secret',
                { expiresIn: '24h' }
            );
    
            const refreshToken = jwt.sign(
                { userId: newUser.id },
                process.env.JWT_SECRET || 'default_secret',
                { expiresIn: '7d' }
            );
    
            return {
                status: 'success',
                message: 'User registered successfully.',
                data: {
                    username: newUser.username,
                    email: newUser.email,
                    access_token: accessToken,
                    refresh_token: refreshToken
                }
            };
        }catch(e: any){
            return {
                status: 'failed',
                message: 'Failed to register user.',
                data: {error: e.message}
            };
        }
    }

    businessLogin = async (email: string, password: string) => {
        try {
            const business = await BusinessProfile.findOne({ where: { email } });
            
            if (!business) {
                throw new Error('Business profile does not exist.');
            }
    
            const isPasswordValid = await compare(password, business.password!);
            
            if (!isPasswordValid) {
                throw new Error('Invalid login credentials.');
            }
    
            const accessToken = jwt.sign(
                { userId: business.id },
                process.env.JWT_SECRET || 'default_secret',
                { expiresIn: '24h' }
            );
    
            const profilePicture = business.image ? `${business.image}` : null;
    
            return {
                status: 'success',
                message: 'Login successful.',
                data: {
                    user: {
                        business_id: business.id,
                        username: business.name,
                        fullName: business.name,
                        email: business.email,
                        userType: 'business',
                        profilePicture: profilePicture,
                        token: accessToken,
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
        } catch (error) {
            throw error;
        }
    };
}
