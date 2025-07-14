// Firebase configuration
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "your-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "your-project"}.appspot.com`,
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// API configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Stripe configuration
export const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key';

// App configuration
export const APP_NAME = 'Zoi Marketing';
export const APP_DESCRIPTION = 'AI-Powered Digital Marketing Platform';
