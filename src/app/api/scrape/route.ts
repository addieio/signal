import { NextResponse } from "next/server";
import { scrapeAllPlatforms } from "@/lib/scraper";

export const dynamic = "force-dynamic";

/** Manual, stateless sync. The browser owns the resulting local cache. */
export async function POST() {
  const snapshot = await scrapeAllPlatforms();
  const available = snapshot.sources.filter((source) => source.state === "success" || source.state === "empty").length;
  return NextResponse.json({ success: available > 0, ...snapshot }, { status: available > 0 ? 200 : 502 });
}

export async function GET() { return POST(); }
