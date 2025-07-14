import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { prisma } from '../utils/db';
import { AuthRequest } from '../middleware/auth';

export const register = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: { message: 'Validation failed', details: errors.array() }
      });
    }

    const { email, firebaseUid } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { firebaseUid }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: { message: 'User already exists' }
      });
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        firebaseUid
      }
    });

    // Create default plan
    await prisma.plan.create({
      data: {
        userId: user.id,
        planType: 'FREE'
      }
    });

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to register user' }
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: { message: 'Validation failed', details: errors.array() }
      });
    }

    const { email, firebaseUid } = req.body;

    // Find user
    const user = await prisma.user.findFirst({
      where: {
        AND: [
          { email },
          { firebaseUid }
        ]
      },
      include: {
        profile: true,
        plan: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid credentials' }
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          profile: user.profile,
          plan: user.plan,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to login user' }
    });
  }
};

export const verifyToken = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Unauthorized' }
      });
    }

    // Find user by Firebase UID
    const user = await prisma.user.findUnique({
      where: { firebaseUid: req.user.uid },
      include: {
        profile: true,
        plan: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          profile: user.profile,
          plan: user.plan,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to verify token' }
    });
  }
};
