import { NextResponse } from "next/server";
import { z } from "zod";
import { BASE_SNAPSHOT } from "@/lib/repository";
import { askSignalGenie } from "@/lib/signalGenie";

const requestSchema = z.object({
  message: z.string().trim().min(1).max(500),
  profile: z.any().optional(),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Provide a message up to 500 characters." },
        { status: 400 }
      );
    }

    const outcome = await askSignalGenie(
      parsed.data.message,
      BASE_SNAPSHOT.events,
      parsed.data.profile || null
    );

    return NextResponse.json({
      reply: outcome.reply,
      suggestedEvents: outcome.suggestedEvents,
      source: outcome.source,
    });
  } catch (err) {
    console.error("API /api/genie error:", err);
    return NextResponse.json({ error: "Failed to process request." }, { status: 500 });
  }
}
