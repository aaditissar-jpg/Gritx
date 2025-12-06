
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User } from '@supabase/supabase-js';

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const applyAdminFlag = (currentUser: User | null) => {
    if (!currentUser) {
      setIsAdmin(false);
      return;
    }
    const email = currentUser.email?.trim().toLowerCase() || '';
    setIsAdmin(ADMIN_EMAILS.includes(email));
  };

  useEffect(() => {
    // Check active sessions and set the user
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      applyAdminFlag(currentUser);
      setLoading(false);
    };

    getSession();

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      applyAdminFlag(currentUser);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    // Optional: Clear admin local storage if used
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('isAuthenticated');
    setIsAdmin(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
