'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getCurrentUser } from '@/lib/actions/authActions';
import { useRouter } from 'next/navigation';

type User = {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  reloadPage: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  const reloadPage = useCallback(() => {
    window.location.reload();
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      router.refresh();
    } catch (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
    }
  }, [router]);

  const signOut = useCallback(async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      router.refresh();
      router.push('/');
      
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  }, [supabase.auth, router]);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error checking user:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_IN' && session) {
          try {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
            router.refresh();
          } catch (error) {
            console.error('Error after sign in:', error);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          router.refresh();
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []); // ✅ EMPTY DEPENDENCY ARRAY - chỉ chạy 1 lần khi mount

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      signOut, 
      refreshUser, 
      reloadPage 
    }}>
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