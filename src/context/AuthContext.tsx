
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User } from '@supabase/supabase-js';

// Define hardcoded admin emails here for fail-safe access
const ADMIN_EMAILS = ['aadit.issar@gmail.com'];

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  // Centralized logic to determine admin status
  const checkUserRole = async (currentUser: User | null) => {
    if (!currentUser) {
      setIsAdmin(false);
      return;
    }

    const email = (currentUser.email || '').trim().toLowerCase();
    
    // 1. FAIL-SAFE: Hardcoded Check
    // This runs immediately and guarantees access for specific emails
    if (ADMIN_EMAILS.includes(email)) {
      console.log(`[Auth] Admin access granted via whitelist: ${email}`);
      setIsAdmin(true);
      return;
    }

    // 2. DATABASE: Check Profiles Table
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentUser.id)
        .single();
      
      if (!error && data && data.role === 'admin') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (err) {
      console.error('[Auth] Error checking admin role:', err);
      // Do not reset to false if it was already true from hardcode, but here hardcode is handled above
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user ?? null;
        
        if (mounted) {
          setUser(currentUser);
          await checkUserRole(currentUser);
        }
      } catch (error) {
        console.error('[Auth] Initialization failed:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      if (mounted) {
        setUser(currentUser);
        // Do not toggle loading here to prevent flashing, just update role in background
        await checkUserRole(currentUser);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
