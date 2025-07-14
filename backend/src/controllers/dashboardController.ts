import { Response } from 'express';
import { prisma } from '../utils/db';
import { AuthRequest } from '../middleware/auth';

export const getDashboardData = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Unauthorized' }
      });
    }

    // Get user with all related data
    const user = await prisma.user.findUnique({
      where: { firebaseUid: req.user.uid },
      include: {
        profile: true,
        plan: true,
        sites: {
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        contents: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    // Get metrics
    const metrics = await prisma.metric.groupBy({
      by: ['type'],
      where: { userId: user.id },
      _sum: { value: true }
    });

    // Transform metrics to object
    const metricsObj = metrics.reduce((acc, metric) => {
      acc[metric.type] = metric._sum.value || 0;
      return acc;
    }, {} as Record<string, number>);

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentMetrics = await prisma.metric.findMany({
      where: {
        userId: user.id,
        createdAt: { gte: thirtyDaysAgo }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    // Count totals
    const totalSites = await prisma.site.count({
      where: { userId: user.id }
    });

    const totalContent = await prisma.content.count({
      where: { userId: user.id }
    });

    const publishedSites = await prisma.site.count({
      where: { 
        userId: user.id,
        isPublished: true 
      }
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt
        },
        profile: user.profile,
        plan: user.plan,
        recentSites: user.sites,
        recentContent: user.contents,
        metrics: {
          totalSites,
          totalContent,
          publishedSites,
          contentGenerated: metricsObj.content_generated || 0,
          sitesCreated: metricsObj.sites_created || 0,
          pageViews: metricsObj.page_views || 0
        },
        recentActivity: recentMetrics
      }
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get dashboard data' }
    });
  }
};
