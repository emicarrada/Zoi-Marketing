import { Response } from 'express';
import { validationResult } from 'express-validator';
import { prisma } from '../utils/db';
import { AuthRequest } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';

export const createSite = async (req: AuthRequest, res: Response) => {
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

    const { title, template, content } = req.body;

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

    // Generate unique slug
    const slug = `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${uuidv4().slice(0, 8)}`;

    // Create site
    const site = await prisma.site.create({
      data: {
        userId: user.id,
        title,
        slug,
        template: template || 'basic',
        content: content || {},
        isPublished: false
      }
    });

    // Track metric
    await prisma.metric.create({
      data: {
        userId: user.id,
        type: 'sites_created',
        metadata: { siteId: site.id, template }
      }
    });

    res.status(201).json({
      success: true,
      data: { site }
    });
  } catch (error) {
    console.error('Create site error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create site' }
    });
  }
};

export const getSites = async (req: AuthRequest, res: Response) => {
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

    const [sites, total] = await Promise.all([
      prisma.site.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize
      }),
      prisma.site.count({ where: { userId: user.id } })
    ]);

    res.json({
      success: true,
      data: {
        sites,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      }
    });
  } catch (error) {
    console.error('Get sites error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get sites' }
    });
  }
};

export const updateSite = async (req: AuthRequest, res: Response) => {
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

    const { id } = req.params;
    const { title, content } = req.body;

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

    // Update site
    const site = await prisma.site.updateMany({
      where: { 
        id,
        userId: user.id 
      },
      data: {
        ...(title && { title }),
        ...(content && { content })
      }
    });

    if (site.count === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Site not found' }
      });
    }

    // Get updated site
    const updatedSite = await prisma.site.findUnique({
      where: { id }
    });

    res.json({
      success: true,
      data: { site: updatedSite }
    });
  } catch (error) {
    console.error('Update site error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update site' }
    });
  }
};

export const publishSite = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Unauthorized' }
      });
    }

    const { id } = req.params;

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

    // Publish site
    const site = await prisma.site.updateMany({
      where: { 
        id,
        userId: user.id 
      },
      data: {
        isPublished: true
      }
    });

    if (site.count === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Site not found' }
      });
    }

    // Get updated site
    const publishedSite = await prisma.site.findUnique({
      where: { id }
    });

    res.json({
      success: true,
      data: { 
        site: publishedSite,
        publicUrl: `https://zoi-sites.vercel.app/${publishedSite?.slug}`
      }
    });
  } catch (error) {
    console.error('Publish site error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to publish site' }
    });
  }
};
