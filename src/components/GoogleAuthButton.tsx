"use client";

import { useEffect, useState } from "react";
import { LogIn, LogOut, User as UserIcon, Check } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { SupabaseAuthModal } from "./SupabaseAuthModal";

export function GoogleAuthButton() {
  const { user, initialize, signInWithGoogle, signOut, setShowConfigModal, isConfigured } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleLoginClick = () => {
    if (!isConfigured) {
      setShowConfigModal(true);
    } else {
      signInWithGoogle();
    }
  };

  return (
    <>
      {user ? (
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-surface2 px-2.5 py-1.5 text-xs font-bold text-text hover:border-peri/40 transition cursor-pointer shadow-xs"
          >
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="h-6 w-6 rounded-full object-cover ring-1 ring-peri/50"
              />
            ) : (
              <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-[10px] text-white font-bold">
                {user.name[0]?.toUpperCase()}
              </div>
            )}
            <span className="hidden lg:inline truncate max-w-[100px]">{user.name.split(" ")[0]}</span>
            {user.isDemo && (
              <span className="text-[9px] font-mono bg-amber-400/20 text-amber-300 px-1 rounded uppercase">
                DEMO
              </span>
            )}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-white/10 bg-surface p-2 shadow-2xl z-50">
              <div className="px-3 py-2 border-b border-white/8 mb-1">
                <p className="text-xs font-bold text-text truncate">{user.name}</p>
                <p className="text-[10px] text-muted truncate">{user.email}</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false);
                  signOut();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-neg hover:bg-neg/10 transition cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={handleLoginClick}
          className="inline-flex min-h-9 sm:min-h-10 items-center gap-2 rounded-xl border border-white/12 bg-white px-3 sm:px-3.5 text-xs font-bold text-gray-900 shadow-sm hover:bg-gray-100 transition active:scale-95 cursor-pointer"
          title="Sign in with Google via Supabase"
        >
          <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span className="hidden sm:inline">Google Login</span>
          <span className="sm:hidden">Login</span>
        </button>
      )}

      <SupabaseAuthModal />
    </>
  );
}
