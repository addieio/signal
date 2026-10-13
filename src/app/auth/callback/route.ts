import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/home";

  if (code && isSupabaseConfigured()) {
    try {
      await supabase.auth.exchangeCodeForSession(code);
    } catch (error) {
      console.error("Auth callback error:", error);
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
