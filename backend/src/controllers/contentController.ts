import { Response } from 'express';
import { validationResult } from 'express-validator';
import { prisma } from '../utils/db';
import { AuthRequest } from '../middleware/auth';
import { ollamaService } from '../services/ollamaService';

export const getContentSuggestions = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Unauthorized' }
      });
    }

    // Get user profile
    const user = await prisma.user.findUnique({
      where: { firebaseUid: req.user.uid },
      include: { profile: true }
    });

    if (!user || !user.profile) {
      return res.status(400).json({
        success: false,
        error: { message: 'Please complete your profile first' }
      });
    }

    // Generate suggestions using AI
    const suggestions = await ollamaService.generateContentSuggestions(user.profile);

    res.json({
      success: true,
      data: { suggestions }
    });
  } catch (error) {
    console.error('Content suggestions error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get content suggestions' }
    });
  }
};

export const generateContent = async (req: AuthRequest, res: Response) => {
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

    const { type, prompt, platform } = req.body;

    // Get user profile
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

    // Generate content
    const generatedContent = await ollamaService.generateContentForMarketing(
      type,
      prompt,
      user.profile
    );

    // Track metric
    await prisma.metric.create({
      data: {
        userId: user.id,
        type: 'content_generated',
        metadata: { contentType: type, platform, prompt }
      }
    });

    res.json({
      success: true,
      data: {
        content: generatedContent,
        type,
        platform
      }
    });
  } catch (error) {
    console.error('Content generation error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to generate content' }
    });
  }
};

export const saveContent = async (req: AuthRequest, res: Response) => {
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

    const { type, title, body, platform } = req.body;

    // Get user
    const user = await prisma.user.findUnique({
      where: { firebaseUid: req.user.uid }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    // Save content
    const content = await prisma.content.create({
      data: {
        userId: user.id,
        type,
        title,
        body,
        platform,
        status: 'draft'
      }
    });

    res.status(201).json({
      success: true,
      data: { content }
    });
  } catch (error) {
    console.error('Save content error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to save content' }
    });
  }
};

export const getContent = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Unauthorized' }
      });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { firebaseUid: req.user.uid }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    // Paginación
    const page = parseInt((req.query.page as string) || '1', 10);
    const pageSize = parseInt((req.query.pageSize as string) || '10', 10);
    const skip = (page - 1) * pageSize;

    const [content, total] = await Promise.all([
      prisma.content.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize
      }),
      prisma.content.count({ where: { userId: user.id } })
    ]);

    res.json({
      success: true,
      data: {
        content,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      }
    });
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get content' }
    });
  }
};
