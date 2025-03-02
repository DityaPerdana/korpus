import React, { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import {
  AuthUser,
  getCurrentSession,
  getCurrentUser,
  signIn,
  signInWithOAuth,
  signOut,
  signUp,
} from "@/lib/auth";
type Provider =
  | "google"
  | "github"
  | "gitlab"
  | "bitbucket"
  | "azure"
  | "twitter"
  | "apple"
  | "slack"
  | "spotify"
  | "discord"
  | "twitch"
  | "linkedin"
  | "workos"
  | "notion"
  | "keycloak";
import { supabase } from "@/lib/supabase";

type AuthContextType = {
  session: Session | null;
  user: AuthUser;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    metadata?: { full_name?: string },
  ) => Promise<{
    data: any;
    error: any;
  }>;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{
    data: any;
    error: any;
  }>;
  signInWithOAuth: (provider: Provider) => Promise<{
    data: any;
    error: any;
  }>;
  signOut: () => Promise<{
    error: any;
  }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      setLoading(true);
      try {
        // Get initial session
        const { session: currentSession } = await getCurrentSession();
        setSession(currentSession);

        if (currentSession) {
          const { user: currentUser } = await getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state changed:", event, !!currentSession);
      setSession(currentSession);
      if (currentSession) {
        const { user: currentUser } = await getCurrentUser();
        console.log("Current user:", currentUser);
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user,
    loading,
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
