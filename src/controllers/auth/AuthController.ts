import { Request, Response } from 'express';
import { AuthService } from '../../services/auth/AuthService';

const authService = new AuthService();

export class AuthController {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const response = await authService.loginUser(email, password);
      res.status(200).json(response);
    } catch (error: any) {
      res.status(401).json({
        status: 'fail',
        message: error.message || 'Login failed',
      });
    }
  }

  async register(req: Request, res: Response) {
    const { username, email, password, confirm_password: confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
        res.status(400).json({
            status: 'failed',
            message: 'Registration failed.',
            data: {
                error: ['All fields are required.']
            }
        });
    }

    try {
        const result = await authService.registerUser(username, email, password, confirmPassword);
        if (result.status === 'failed') {
            res.status(400).json(result);
        }
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to create user.',
            data: {}
        });
    }
}
}
