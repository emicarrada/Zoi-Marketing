import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';

// Initialize Firebase Admin only if credentials are provided
let firebaseInitialized = false;

if (!admin.apps.length && process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
    firebaseInitialized = true;
    console.log('✅ Firebase Admin initialized');
  } catch (error) {
    console.warn('⚠️ Firebase Admin initialization failed:', error);
  }
} else {
  console.log('⚠️ Firebase credentials not provided - running in development mode');
}

export interface AuthRequest extends Request {
  user?: {
    uid: string;
    email: string;
  };
  body: any;
  params: any;
  headers: any;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: { message: 'Access token required' }
      });
    }

    // Skip Firebase verification in development if not initialized
    if (!firebaseInitialized && process.env.NODE_ENV === 'development') {
      console.log('⚠️ Development mode: Skipping Firebase token verification');
      req.user = {
        uid: 'dev-user',
        email: 'dev@example.com'
      };
      return next();
    }

    if (!firebaseInitialized) {
      return res.status(500).json({
        success: false,
        error: { message: 'Authentication service not configured' }
      });
    }

    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || ''
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      error: { message: 'Invalid or expired token' }
    });
  }
};
