import { Response } from 'express';
import { validationResult } from 'express-validator';
import { prisma } from '../utils/db';
import { AuthRequest } from '../middleware/auth';

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: { message: 'Validation failed', details: errors.array() }
      });
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Unauthorized' }
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { firebaseUid: req.user.uid }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    const {
      businessType,
      businessName,
      targetAudience,
      tone,
      primaryColors,
      description,
      goals
    } = req.body;

    // Create or update profile
    const profile = await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        businessType,
        businessName,
        targetAudience,
        tone,
        primaryColors,
        description,
        goals
      },
      create: {
        userId: user.id,
        businessType,
        businessName,
        targetAudience,
        tone,
        primaryColors,
        description,
        goals
      }
    });

    res.json({
      success: true,
      data: { profile }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update profile' }
    });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Unauthorized' }
      });
    }

    // Find user with profile
    const user = await prisma.user.findUnique({
      where: { firebaseUid: req.user.uid },
      include: { profile: true }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    res.json({
      success: true,
      data: { profile: user.profile }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get profile' }
    });
  }
};
