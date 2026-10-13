import type { Event, EventType, EventMode } from "./types";

export interface ParsedFilters {
  query: string;
  type?: EventType;
  mode?: EventMode;
  city?: string;
  themes: string[];
  vibeNeeds: string[];
  maxCrowd?: number;
}

const TYPE_MAP: Record<string, EventType> = {
  hackathon: "hackathon",
  hack: "hackathon",
  hacks: "hackathon",
  workshop: "workshop",
  bootcamp: "workshop",
  masterclass: "workshop",
  competition: "competition",
  ctf: "competition",
  contest: "competition",
  talk: "talk",
  summit: "talk",
  conference: "talk",
  symposium: "talk",
  cultural: "cultural",
  fest: "cultural",
  salon: "cultural",
};

const MODE_MAP: Record<string, EventMode> = {
  offline: "offline",
  campus: "offline",
  "in-person": "offline",
  physical: "offline",
  online: "online",
  virtual: "online",
  remote: "online",
  hybrid: "hybrid",
};

export function parseQuery(query: string): ParsedFilters {
  const qLower = query.toLowerCase();

  const filters: ParsedFilters = {
    query,
    themes: [],
    vibeNeeds: [],
  };

  // 1. Detect Mode
  for (const [key, mode] of Object.entries(MODE_MAP)) {
    if (new RegExp(`\\b${key}\\b`, "i").test(qLower)) {
      filters.mode = mode;
      break;
    }
  }

  // 2. Detect Type
  for (const [key, type] of Object.entries(TYPE_MAP)) {
    if (new RegExp(`\\b${key}\\b`, "i").test(qLower)) {
      filters.type = type;
      break;
    }
  }

  // 3. Detect City
  if (/delhi|ncr|noida|gurgaon|gurugram|iiitd|dtu|nsut|igdtuw|iitd/i.test(qLower)) {
    filters.city = "Delhi";
  } else if (/bangalore|bengaluru|iisc/i.test(qLower)) {
    filters.city = "Bangalore";
  } else if (/mumbai|powai|iitb/i.test(qLower)) {
    filters.city = "Mumbai";
  } else if (/chennai|iitm/i.test(qLower)) {
    filters.city = "Chennai";
  }

  // 4. Detect Themes
  if (/ai|ml|machine.learn|deep.learn|neural|llm|gpt|transformer|agent/i.test(qLower)) {
    filters.themes.push("AI/ML");
  }
  if (/assistive|accessibility|disabled|screen.reader/i.test(qLower)) {
    filters.themes.push("Assistive Tech");
  }
  if (/web3|crypto|blockchain|smart.contract|defi/i.test(qLower)) {
    filters.themes.push("Web3");
  }
  if (/devops|cloud|system|kubernetes|infra|linux|rust/i.test(qLower)) {
    filters.themes.push("Systems");
  }
  if (/design|ui|ux|figma|frontend/i.test(qLower)) {
    filters.themes.push("UI/UX");
  }
  if (/fintech|quant|trading|finance|upi/i.test(qLower)) {
    filters.themes.push("Fintech");
  }
  if (/cyber|security|infosec|ctf|pwn/i.test(qLower)) {
    filters.themes.push("Cybersecurity");
  }
  if (/open.source|gsoc|git|foss/i.test(qLower)) {
    filters.themes.push("Open Source");
  }
  if (/robot|hardware|drone|iot|bci/i.test(qLower)) {
    filters.themes.push("Robotics");
  }

  // 5. Detect Vibe Needs
  if (/mentor|guidance|teacher|prof/i.test(qLower)) {
    filters.vibeNeeds.push("mentors");
  }
  if (/wifi|internet|network|speed/i.test(qLower)) {
    filters.vibeNeeds.push("wifi");
  }
  if (/food|meal|midnight|pizza|chai|snack/i.test(qLower)) {
    filters.vibeNeeds.push("food");
  }
  if (/swag|hoodie|sticker|kit|perk/i.test(qLower)) {
    filters.vibeNeeds.push("swag");
  }
  if (/intimate|hidden|quiet|gem|underrated|underground|small/i.test(qLower)) {
    filters.vibeNeeds.push("intimate");
    filters.maxCrowd = 280;
  }

  return filters;
}

export function filterEventsByQuery(
  events: Event[],
  filters: ParsedFilters
): { matched: Event[]; explanation: string } {
  let list = [...events];

  // Mode filter
  if (filters.mode) {
    list = list.filter((e) => e.mode === filters.mode || e.mode === "hybrid");
  }

  // Type filter
  if (filters.type) {
    list = list.filter((e) => e.type === filters.type);
  }

  // City filter
  if (filters.city) {
    list = list.filter((e) => e.city.toLowerCase() === filters.city?.toLowerCase());
  }

  // Crowd size filter
  if (filters.maxCrowd) {
    list = list.filter((e) => e.goingCount <= filters.maxCrowd!);
  }

  // Themes filter (soft boost: match any or score higher)
  if (filters.themes.length > 0) {
    list.sort((a, b) => {
      const aMatches = a.themes.filter((t) =>
        filters.themes.some((ft) => t.toLowerCase().includes(ft.toLowerCase()))
      ).length;
      const bMatches = b.themes.filter((t) =>
        filters.themes.some((ft) => t.toLowerCase().includes(ft.toLowerCase()))
      ).length;
      return bMatches - aMatches;
    });
  }

  // Vibe needs filter
  if (filters.vibeNeeds.length > 0) {
    list.sort((a, b) => {
      const aVibe = a.reviews.flatMap((r) => r.tags).filter((t) =>
        filters.vibeNeeds.some((v) => t.category === v && t.sentiment === "pos")
      ).length;
      const bVibe = b.reviews.flatMap((r) => r.tags).filter((t) =>
        filters.vibeNeeds.some((v) => t.category === v && t.sentiment === "pos")
      ).length;
      return bVibe - aVibe;
    });
  }

  // Fallback if strict filter removed all
  if (list.length === 0) {
    list = events.slice(0, 5);
  }

  const topMatch = list[0];
  const explanation = topMatch
    ? `Top match: ${topMatch.title} at ${topMatch.organizer.name} — matched ${
        filters.themes.length > 0 ? filters.themes.join(", ") : "your search intent"
      } with verified positive community vibe.`
    : "Showing top recommended events matching your criteria.";

  return { matched: list, explanation };
}
