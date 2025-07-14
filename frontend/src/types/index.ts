// API types
export interface User {
  id: string;
  email: string;
  createdAt: string;
  profile?: Profile;
  plan?: Plan;
}

export interface Profile {
  id: string;
  businessType: string;
  businessName?: string;
  targetAudience?: string;
  tone?: 'casual' | 'professional' | 'friendly' | 'formal';
  primaryColors?: string[];
  description?: string;
  goals?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Plan {
  id: string;
  planType: 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE';
  stripeCustomerId?: string;
  subscriptionId?: string;
  currentPeriodEnd?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Content {
  id: string;
  type: 'SOCIAL_POST' | 'BLOG_POST' | 'EMAIL' | 'AD_COPY' | 'WEBSITE_COPY';
  title: string;
  body: string;
  platform?: string;
  status: 'draft' | 'published' | 'scheduled';
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Site {
  id: string;
  title: string;
  slug: string;
  content?: any;
  template: string;
  isPublished: boolean;
  customDomain?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardData {
  user: User;
  profile: Profile;
  plan: Plan;
  recentSites: Site[];
  recentContent: Content[];
  metrics: {
    totalSites: number;
    totalContent: number;
    publishedSites: number;
    contentGenerated: number;
    sitesCreated: number;
    pageViews: number;
  };
  recentActivity: any[];
}

// Component props
export interface OnboardingData {
  businessType: string;
  businessName: string;
  targetAudience: string;
  tone: string;
  primaryColors: string[];
  description: string;
  goals: string[];
}

// API Response
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: any[];
  };
}
