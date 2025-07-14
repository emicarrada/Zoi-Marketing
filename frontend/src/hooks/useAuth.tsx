import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { authAPI } from '../lib/api';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // Get the Firebase ID token
          const token = await firebaseUser.getIdToken();
          localStorage.setItem('authToken', token);
          
          // Verify with our backend and get user data
          const response = await authAPI.verify();
          if (response.data?.user) {
            setUser(response.data.user);
          }
        } catch (error) {
          console.error('Auth verification error:', error);
          // If verification fails, try to register the user
          try {
            await authAPI.register({
              email: firebaseUser.email!,
              firebaseUid: firebaseUser.uid
            });
            const response = await authAPI.verify();
            if (response.data?.user) {
              setUser(response.data.user);
            }
          } catch (registerError) {
            console.error('Auto-registration failed:', registerError);
          }
        }
      } else {
        setUser(null);
        localStorage.removeItem('authToken');
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const token = await result.user.getIdToken();
      localStorage.setItem('authToken', token);
      
      const response = await authAPI.login({
        email: result.user.email!,
        firebaseUid: result.user.uid
      });
      
      if (response.data?.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const token = await result.user.getIdToken();
      localStorage.setItem('authToken', token);
      
      const response = await authAPI.register({
        email: result.user.email!,
        firebaseUid: result.user.uid
      });
      
      if (response.data?.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      localStorage.setItem('authToken', token);
      
      // Try to login first, if it fails, register
      try {
        const response = await authAPI.login({
          email: result.user.email!,
          firebaseUid: result.user.uid
        });
        
        if (response.data?.user) {
          setUser(response.data.user);
        }
      } catch (loginError) {
        // If login fails, register the user
        const response = await authAPI.register({
          email: result.user.email!,
          firebaseUid: result.user.uid
        });
        
        if (response.data?.user) {
          setUser(response.data.user);
        }
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem('authToken');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value = {
    user,
    firebaseUser,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
