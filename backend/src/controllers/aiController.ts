import { Response } from 'express';
import { validationResult } from 'express-validator';
import { prisma } from '../utils/db';
import { AuthRequest } from '../middleware/auth';
import { ollamaService } from '../services/ollamaService';

export const generateAIContent = async (req: AuthRequest, res: Response) => {
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

    const { prompt, type, context } = req.body;

    // Get user profile for context
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

    // Generate content using AI
    const generatedContent = await ollamaService.generateContentForMarketing(
      type || 'SOCIAL_POST',
      prompt,
      user.profile
    );

    // Track metric
    await prisma.metric.create({
      data: {
        userId: user.id,
        type: 'content_generated',
        metadata: { contentType: type, prompt }
      }
    });

    res.json({
      success: true,
      data: {
        content: generatedContent,
        type: type || 'SOCIAL_POST'
      }
    });
  } catch (error) {
    console.error('AI content generation error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to generate AI content' }
    });
  }
};

export const chatWithAI = async (req: AuthRequest, res: Response) => {
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

    const { message, context } = req.body;

    // Get user profile for context
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

    // Add user profile to context
    const fullContext = {
      ...context,
      userProfile: user.profile
    };

    // Chat with AI
    const response = await ollamaService.chatWithAI(message, fullContext);

    res.json({
      success: true,
      data: {
        response,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to chat with AI' }
    });
  }
};
