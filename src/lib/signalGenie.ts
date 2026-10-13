import type { Event, UserProfile } from "./types";
import { matchGenieEvents } from "./genieMatcher";

export interface GenieResponse {
  reply: string;
  suggestedEvents: Event[];
  source: "signal_ai" | "heuristic";
}

export async function askSignalGenie(
  userQuery: string,
  events: Event[],
  profile?: UserProfile | null
): Promise<GenieResponse> {
  // First run heuristic matcher to get accurate deterministic slice
  const heuristic = matchGenieEvents(userQuery, events, profile);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      reply: heuristic.reply,
      suggestedEvents: heuristic.results,
      source: "heuristic",
    };
  }

  const primaryModel = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
  const modelsToTry = [primaryModel, "gemini-3.5-flash-lite", "gemini-flash-latest"];
  const uniqueModels = Array.from(new Set(modelsToTry));

  // Provide relevant events context (up to 30 events to avoid token bloat)
  // Prioritize heuristic results + relevant city/theme events
  const prioritySet = new Set(heuristic.results.map((e) => e.slug));
  const candidatePool = [
    ...heuristic.results,
    ...events.filter((e) => !prioritySet.has(e.slug)).slice(0, 24),
  ];

  const catalogContext = candidatePool.map((e) => ({
    slug: e.slug,
    title: e.title,
    city: e.city,
    venue: e.venue,
    mode: e.mode,
    dates: e.dateLabel,
    prize: e.prizeLabel || "Bounties & Perks",
    organizer: e.organizer.name,
    themes: e.themes.slice(0, 4),
    source: e.source,
    url: e.sourceUrl,
  }));

  const systemInstruction = `You are Signal Genie, an enthusiastic, highly knowledgeable AI Hackathon Copilot for developers and student builders.
Answer the user's question with natural, well-formatted markdown.

STRICT ACCURACY & GROUNDING RULES:
1. ONLY recommend events present in the VERIFIED CATALOGUE below. Never invent hackathons or mix up cities.
2. If the user asks for New Delhi or Delhi, only suggest hackathons strictly located in Delhi / New Delhi. Do NOT suggest Ghaziabad or Meerut unless the user explicitly asks for NCR.
3. If the user asks for Bengaluru, only suggest events located in Bengaluru / Bangalore. If online/remote is requested, only suggest virtual events.
4. Highlight dates, venues, prize pools, and tracks clearly with bullet points and bold text.
5. You are Signal Genie (or Signal AI). NEVER mention 'Gemini', 'Google', 'DeepMind', or any underlying AI provider name under any circumstances. Always refer to yourself strictly as Signal Genie or Signal AI.
6. At the very end of your response, output a single JSON block specifying the exact slugs of recommended events (max 5) like:
\`\`\`json
{"recommendedSlugs": ["slug1", "slug2"]}
\`\`\`

VERIFIED CATALOGUE:
${JSON.stringify(catalogContext, null, 2)}`;

  for (const currentModel of uniqueModels) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${apiKey}`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: systemInstruction },
                { text: `User Question: "${userQuery}"` },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1000,
          },
        }),
      });

      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          return processSignalAiOutput(rawText, candidatePool, heuristic);
        }
      } else {
        console.warn(`Signal AI model ${currentModel} returned ${res.status}, trying next model...`);
      }
    } catch (err) {
      console.warn(`Error trying Signal AI model ${currentModel}:`, err);
    }
  }

  // Graceful fallback to heuristic
  return {
    reply: heuristic.reply,
    suggestedEvents: heuristic.results,
    source: "heuristic",
  };
}

// Backward-compatibility alias
export const askGeminiGenie = askSignalGenie;

function processSignalAiOutput(
  rawText: string,
  candidatePool: Event[],
  heuristic: { reply: string; results: Event[] }
): GenieResponse {
  // Extract JSON slug recommendations if present
  let cleanReply = rawText;
  let recommendedSlugs: string[] = [];

  const jsonMatch = rawText.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[1]);
      if (Array.isArray(parsed.recommendedSlugs)) {
        recommendedSlugs = parsed.recommendedSlugs;
      }
      // Remove JSON block from user-facing text
      cleanReply = rawText.replace(/```json\s*[\s\S]*?\s*```/, "").trim();
    } catch {
      // ignore json parse error
    }
  }

  // Strict output sanitizer: Never expose underlying AI provider names
  cleanReply = cleanReply
    .replace(/Google Gemini/gi, "Signal AI")
    .replace(/Gemini AI/gi, "Signal AI")
    .replace(/Gemini/gi, "Signal AI")
    .replace(/Google's/gi, "Signal's")
    .replace(/Google AI/gi, "Signal Intelligence");

  // Match recommended slugs to real Event objects
  let matchedEvents: Event[] = [];
  if (recommendedSlugs.length > 0) {
    matchedEvents = candidatePool.filter((e) => recommendedSlugs.includes(e.slug));
  }

  // Fallback to heuristic results if AI didn't specify valid slugs
  if (matchedEvents.length === 0) {
    matchedEvents = heuristic.results;
  }

  return {
    reply: cleanReply,
    suggestedEvents: matchedEvents.slice(0, 5),
    source: "signal_ai",
  };
}
