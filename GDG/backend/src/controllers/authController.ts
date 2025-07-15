import { Request, Response } from 'express';
import * as authService from '../services/authService';
import { IRegisterRequest, ILoginRequest, AuthRequest } from '../types';

// Register controller
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const userData: IRegisterRequest = req.body;
    console.log('Register request data:', userData);
    const { user, token } = await authService.register(userData);
    res.status(201).json({ user, token }); // Fix: Remove nested "data"
  } catch (error: any) {
    console.error('Error during registration:', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Login controller
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const credentials: ILoginRequest = req.body;
    console.log('Login request data:', credentials);
    const { user, token } = await authService.login(credentials);
    res.status(200).json({ user, token }); // Fix: Remove nested "data"
  } catch (error: any) {
    console.error('Error during login:', error.message);
    res.status(401).json({ success: false, message: error.message });
  }
};

// Get current user controller
export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }
    const user = await authService.getCurrentUser(req.user._id.toString());
    res.status(200).json({ user }); // Fix: Remove nested "data"
  } catch (error: any) {
    console.error('Error getting current user:', error.message);
    res.status(404).json({ success: false, message: error.message });
  }
};
