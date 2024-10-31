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
}
