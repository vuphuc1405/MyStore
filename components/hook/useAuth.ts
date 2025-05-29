'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Safe user refresh - handle missing session
  const refreshUser = useCallback(async () => {
    try {
      // First check if we have a session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.log('Session error:', sessionError.message);
        setCurrentUser(null);
        return;
      }

      if (!session) {
        console.log('No session found');
        setCurrentUser(null);
        return;
      }

      // If we have session, get user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.log('User error:', userError.message);
        // If session is invalid, clear it
        if (userError.message.includes('session') || userError.message.includes('JWT')) {
          await supabase.auth.signOut();
        }
        setCurrentUser(null);
      } else {
        console.log('User refreshed:', user?.email || 'No user');
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Refresh user failed:', error);
      setCurrentUser(null);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // Safe session check
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.log('Session initialization error:', error.message);
          if (mounted) {
            setCurrentUser(null);
            setInitialized(true);
            setLoading(false);
          }
          return;
        }
        
        if (mounted) {
          setCurrentUser(session?.user || null);
          setInitialized(true);
          setLoading(false);
          console.log('Auth initialized:', session?.user?.email || 'No user');
        }
      } catch (error) {
        console.error('Initialize auth failed:', error);
        if (mounted) {
          setCurrentUser(null);
          setInitialized(true);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email || 'No user');
        
        if (mounted) {
          // Handle different auth events
          switch (event) {
            case 'SIGNED_IN':
              setCurrentUser(session?.user || null);
              setLoading(false);
              if (pathname === '/auth/login' || pathname === '/auth/register') {
                setTimeout(() => {
                  router.push('/');
                  router.refresh();
                }, 100);
              }
              break;
              
            case 'SIGNED_OUT':
              setCurrentUser(null);
              setLoading(false);
              if (pathname.startsWith('/dashboard')) {
                router.push('/auth/login');
              }
              break;
              
            case 'TOKEN_REFRESHED':
              setCurrentUser(session?.user || null);
              setLoading(false);
              break;
              
            default:
              setCurrentUser(session?.user || null);
              setLoading(false);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [router, pathname, refreshUser]);

  // Debug: Log state changes
  useEffect(() => {
    if (initialized) {
      console.log('useAuth state:', { 
        user: currentUser?.email || 'null', 
        loading, 
        initialized 
      });
    }
  }, [currentUser, loading, initialized]);

  return { 
    currentUser, 
    loading: loading || !initialized,
    refreshUser
  };
}