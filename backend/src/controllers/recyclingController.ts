import { Request, Response } from 'express';
import * as recyclingService from '../services/recyclingService';

// Get all recycling centers controller
export const getAllRecyclingCenters = async (req: Request, res: Response) => {
  try {
    const recyclingCenters = await recyclingService.getAllRecyclingCenters();
    res.status(200).json({
      success: true,
      data: { recyclingCenters },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get nearby recycling centers controller
export const getNearbyRecyclingCenters = async (req: Request, res: Response) => {
  try {
    const { lat, lng } = req.query;
    const recyclingCenters = await recyclingService.getNearbyRecyclingCenters(Number(lat), Number(lng));
    res.status(200).json({
      success: true,
      data: { recyclingCenters },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get recycling center by ID controller
export const getRecyclingCenterById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const recyclingCenter = await recyclingService.getRecyclingCenterById(id);
    res.status(200).json({
      success: true,
      data: { recyclingCenter },
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};