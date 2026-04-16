import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth, db, googleProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

export type UserRole = 'client' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  address?: string;
  createdAt: string;
}

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  isAuthReady: boolean;
  authError: string | null;
  clearAuthError: () => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (!user) {
        setUserProfile(null);
        setIsAuthReady(true);
        return;
      }

      // Check for user profile in Firestore
      const userRef = doc(db, 'users', user.uid);
      
      const unsubProfile = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          setUserProfile(docSnap.data() as UserProfile);
        } else {
          // Create initial profile if it doesn't exist
          const newProfile: UserProfile = {
            uid: user.uid,
            email: user.email || '',
            name: user.displayName || 'New User',
            role: user.email === 'juandavidestradagomez@gmail.com' ? 'admin' : 'client',
            createdAt: new Date().toISOString()
          };
          setDoc(userRef, newProfile).catch(err => console.error("Error creating profile:", err));
        }
        setIsAuthReady(true);
      }, (error) => {
        console.error("Profile listen error:", error);
        setIsAuthReady(true);
      });

      return () => unsubProfile();
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      if (error?.code === 'auth/popup-blocked') {
        setAuthError("Popup blocked by browser. Please allow popups for this site, or try clicking the login button again.");
      } else if (error?.code !== 'auth/cancelled-popup-request' && error?.code !== 'auth/popup-closed-by-user') {
        console.error("Login failed:", error);
        setAuthError("An error occurred during login. Please try again.");
      }
    }
  };

  const clearAuthError = () => setAuthError(null);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser || !userProfile) return;
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, { ...userProfile, ...data }, { merge: true });
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, isAuthReady, authError, clearAuthError, loginWithGoogle, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
