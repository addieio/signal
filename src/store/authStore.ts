"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import type { User, Session } from "@supabase/supabase-js";

export interface SignalUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  isDemo?: boolean;
}

interface AuthState {
  user: SignalUser | null;
  session: Session | null;
  isLoading: boolean;
  isConfigured: boolean;
  showConfigModal: boolean;
  setShowConfigModal: (show: boolean) => void;
  initialize: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  simulateGoogleLogin: () => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isLoading: false,
      isConfigured: false,
      showConfigModal: false,

      setShowConfigModal: (show: boolean) => set({ showConfigModal: show }),

      initialize: async () => {
        const configured = isSupabaseConfigured();
        set({ isConfigured: configured });

        if (!configured) {
          // If we have a saved demo user, keep it
          return;
        }

        try {
          set({ isLoading: true });
          const { data, error } = await supabase.auth.getSession();
          if (error) {
            console.warn("Supabase session error:", error.message);
            return;
          }

          if (data.session?.user) {
            const sbUser = data.session.user;
            set({
              session: data.session,
              user: {
                id: sbUser.id,
                email: sbUser.email || "",
                name:
                  sbUser.user_metadata?.full_name ||
                  sbUser.user_metadata?.name ||
                  sbUser.email?.split("@")[0] ||
                  "Hacker",
                avatarUrl:
                  sbUser.user_metadata?.avatar_url ||
                  sbUser.user_metadata?.picture,
                isDemo: false,
              },
            });
          }

          // Subscribe to auth changes
          supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
              set({
                session,
                user: {
                  id: session.user.id,
                  email: session.user.email || "",
                  name:
                    session.user.user_metadata?.full_name ||
                    session.user.user_metadata?.name ||
                    session.user.email?.split("@")[0] ||
                    "Hacker",
                  avatarUrl:
                    session.user.user_metadata?.avatar_url ||
                    session.user.user_metadata?.picture,
                  isDemo: false,
                },
              });
            } else {
              // Only reset if not a demo user
              if (!get().user?.isDemo) {
                set({ user: null, session: null });
              }
            }
          });
        } catch (err) {
          console.warn("Error initializing Supabase Auth:", err);
        } finally {
          set({ isLoading: false });
        }
      },

      signInWithGoogle: async () => {
        const configured = isSupabaseConfigured();
        if (!configured) {
          // Trigger the config modal so user can paste their keys or simulate
          set({ showConfigModal: true });
          return;
        }

        try {
          set({ isLoading: true });
          const redirectOrigin =
            typeof window !== "undefined" ? window.location.origin : "";
          const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
              redirectTo: `${redirectOrigin}/auth/callback`,
              queryParams: {
                access_type: "offline",
                prompt: "consent",
              },
            },
          });

          if (error) {
            console.error("Google Sign-in Error:", error.message);
            alert(`Supabase Google Sign-In error: ${error.message}`);
          }
        } catch (err: any) {
          console.error("Google OAuth Exception:", err);
          alert(`Google Sign-In failed: ${err.message || err}`);
        } finally {
          set({ isLoading: false });
        }
      },

      simulateGoogleLogin: () => {
        set({
          user: {
            id: "google-demo-user-101",
            email: "aditya.hacker@iiitd.ac.in",
            name: "Aditya (IIITD)",
            avatarUrl:
              "https://lh3.googleusercontent.com/a/ACg8ocISY2d6w_sample_google_avatar=s96-c",
            isDemo: true,
          },
          showConfigModal: false,
        });
      },

      signOut: async () => {
        const configured = isSupabaseConfigured();
        if (configured) {
          try {
            await supabase.auth.signOut();
          } catch (e) {
            console.warn("Sign out error:", e);
          }
        }
        set({ user: null, session: null });
      },
    }),
    {
      name: "signal-auth-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
