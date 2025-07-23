import { Request, Response, NextFunction } from 'express';
import admin from '../lib/firebase';

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

    // Modo desarrollo: usuario simulado
    if (process.env.NODE_ENV === 'development') {
      console.log('⚠️ Development mode: Skipping Firebase token verification');
      req.user = {
        uid: 'dev-user',
        email: 'dev@example.com'
      };
      return next();
    }

    // Verificar token de Firebase
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
