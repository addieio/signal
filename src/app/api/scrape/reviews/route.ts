import { NextResponse } from "next/server";
import { BASE_SNAPSHOT } from "@/lib/repository";
import { getScrapedReviewsForEvent, calculateReviewMetrics } from "@/lib/reviewScraper";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const event = BASE_SNAPSHOT.events.find(
        (e) => e.slug.toLowerCase() === slug.toLowerCase() || e.id.toLowerCase() === slug.toLowerCase()
      );

      const target = event || {
        slug,
        title: slug.replace(/-/g, " "),
        source: "devfolio",
      };

      const reviews = getScrapedReviewsForEvent(target);
      const metrics = calculateReviewMetrics(reviews);

      return NextResponse.json({
        success: true,
        slug,
        metrics,
        reviews,
        syncedAt: new Date().toISOString(),
      });
    }

    // Overall summary of scraped community platforms
    return NextResponse.json({
      success: true,
      platforms: ["devfolio", "unstop", "mlh", "luma", "reddit"],
      totalEventsMonitored: BASE_SNAPSHOT.events.length,
      syncedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to query scraped reviews" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const slug = body.slug;

    if (!slug) {
      return NextResponse.json({ error: "Missing event slug" }, { status: 400 });
    }

    const event = BASE_SNAPSHOT.events.find(
      (e) => e.slug.toLowerCase() === slug.toLowerCase() || e.id.toLowerCase() === slug.toLowerCase()
    );

    const target = event || {
      slug,
      title: slug.replace(/-/g, " "),
      source: "devfolio",
    };

    const reviews = getScrapedReviewsForEvent(target);
    const metrics = calculateReviewMetrics(reviews);

    return NextResponse.json({
      success: true,
      slug,
      metrics,
      reviews,
      syncedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to scrape reviews" },
      { status: 500 }
    );
  }
}
