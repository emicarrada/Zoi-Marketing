import axios from 'axios';
import { API_BASE_URL } from './config';
import type { ApiResponse, User, Profile, Content, Site, DashboardData, OnboardingData } from '../types';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data: { email: string; firebaseUid: string }): Promise<ApiResponse<{ user: User }>> =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; firebaseUid: string }): Promise<ApiResponse<{ user: User }>> =>
    api.post('/auth/login', data),
  
  verify: (): Promise<ApiResponse<{ user: User }>> =>
    api.get('/auth/verify'),
};

// User API
export const userAPI = {
  updateProfile: (data: OnboardingData): Promise<ApiResponse<{ profile: Profile }>> =>
    api.post('/user/profile', data),
  
  getProfile: (): Promise<ApiResponse<{ profile: Profile }>> =>
    api.get('/user/profile'),
};

// Content API
export const contentAPI = {
  getSuggestions: (): Promise<ApiResponse<{ suggestions: string[] }>> =>
    api.get('/content/suggestions'),
  
  generate: (data: { type: string; prompt: string; platform?: string }): Promise<ApiResponse<{ content: string; type: string; platform?: string }>> =>
    api.post('/content/generate', data),
  
  save: (data: { type: string; title: string; body: string; platform?: string }): Promise<ApiResponse<{ content: Content }>> =>
    api.post('/content/save', data),
  
  getAll: (): Promise<ApiResponse<{ content: Content[] }>> =>
    api.get('/content'),
};

// Site API
export const siteAPI = {
  create: (data: { title: string; template?: string; content?: any }): Promise<ApiResponse<{ site: Site }>> =>
    api.post('/site/create', data),
  
  getAll: (): Promise<ApiResponse<{ sites: Site[] }>> =>
    api.get('/site'),
  
  update: (id: string, data: { title?: string; content?: any }): Promise<ApiResponse<{ site: Site }>> =>
    api.put(`/site/${id}`, data),
  
  publish: (id: string): Promise<ApiResponse<{ site: Site; publicUrl: string }>> =>
    api.post(`/site/${id}/publish`),
};

// AI API
export const aiAPI = {
  generate: (data: { prompt: string; type?: string; context?: any }): Promise<ApiResponse<{ content: string; type: string }>> =>
    api.post('/ai/generate', data),
  
  chat: (data: { message: string; context?: any }): Promise<ApiResponse<{ response: string; timestamp: string }>> =>
    api.post('/ai/chat', data),
};

// Dashboard API
export const dashboardAPI = {
  getData: (): Promise<ApiResponse<DashboardData>> =>
    api.get('/dashboard/data'),
};

// Stripe API
export const stripeAPI = {
  createSubscription: (data: { planType: string }): Promise<ApiResponse<{ subscriptionId: string; clientSecret: string; status: string }>> =>
    api.post('/stripe/create-subscription', data),
  
  cancelSubscription: (): Promise<ApiResponse<{ message: string; periodEnd: string }>> =>
    api.post('/stripe/cancel-subscription'),
};

export default api;
