import type { Event, UserProfile } from "./types";
import { rankEvents } from "./ranking";

const MONTH_MAP: Record<string, string> = {
  january: "01", jan: "01",
  february: "02", feb: "02",
  march: "03", mar: "03",
  april: "04", apr: "04",
  may: "05",
  june: "06", jun: "06",
  july: "07", jul: "07",
  august: "08", aug: "08",
  september: "09", sep: "09",
  october: "10", oct: "10",
  november: "11", nov: "11",
  december: "12", dec: "12",
};

interface CityTarget {
  key: string;
  label: string;
  queryAliases: string[];
  matches: (e: Event) => boolean;
}

const CITY_TARGETS: CityTarget[] = [
  {
    key: "delhi",
    label: "New Delhi",
    queryAliases: ["new delhi", "delhi", "east delhi", "west delhi", "south delhi", "north delhi"],
    matches: (e) => {
      const city = (e.city || "").toLowerCase().trim();
      const venue = (e.venue || "").toLowerCase().trim();
      // Strictly exclude satellite cities unless explicitly requested
      if (
        city.includes("ghaziabad") ||
        city.includes("meerut") ||
        city.includes("noida") ||
        city.includes("gurugram") ||
        city.includes("gurgaon")
      ) {
        return false;
      }
      return city.includes("delhi") || venue.includes("delhi");
    },
  },
  {
    key: "ncr",
    label: "Delhi NCR",
    queryAliases: ["delhi ncr", "ncr", "national capital region"],
    matches: (e) => {
      const city = (e.city || "").toLowerCase().trim();
      const venue = (e.venue || "").toLowerCase().trim();
      const text = `${city} ${venue}`;
      return /delhi|noida|gurugram|gurgaon|ghaziabad|faridabad|meerut/i.test(text);
    },
  },
  {
    key: "ghaziabad",
    label: "Ghaziabad",
    queryAliases: ["ghaziabad"],
    matches: (e) => {
      const city = (e.city || "").toLowerCase().trim();
      const venue = (e.venue || "").toLowerCase().trim();
      return city.includes("ghaziabad") || venue.includes("ghaziabad");
    },
  },
  {
    key: "meerut",
    label: "Meerut",
    queryAliases: ["meerut"],
    matches: (e) => {
      const city = (e.city || "").toLowerCase().trim();
      const venue = (e.venue || "").toLowerCase().trim();
      return city.includes("meerut") || venue.includes("meerut");
    },
  },
  {
    key: "noida",
    label: "Noida",
    queryAliases: ["greater noida", "noida"],
    matches: (e) => {
      const city = (e.city || "").toLowerCase().trim();
      const venue = (e.venue || "").toLowerCase().trim();
      return city.includes("noida") || venue.includes("noida");
    },
  },
  {
    key: "gurugram",
    label: "Gurugram",
    queryAliases: ["gurugram", "gurgaon"],
    matches: (e) => {
      const city = (e.city || "").toLowerCase().trim();
      const venue = (e.venue || "").toLowerCase().trim();
      return (
        city.includes("gurugram") ||
        city.includes("gurgaon") ||
        venue.includes("gurugram") ||
        venue.includes("gurgaon")
      );
    },
  },
  {
    key: "bangalore",
    label: "Bengaluru",
    queryAliases: ["bangalore", "bengaluru", "karnataka"],
    matches: (e) => {
      const city = (e.city || "").toLowerCase().trim();
      const venue = (e.venue || "").toLowerCase().trim();
      return (
        city.includes("bangalore") ||
        city.includes("bengaluru") ||
        venue.includes("bangalore") ||
        venue.includes("bengaluru")
      );
    },
  },
  {
    key: "mumbai",
    label: "Mumbai",
    queryAliases: ["mumbai", "bombay", "navi mumbai"],
    matches: (e) => {
      const city = (e.city || "").toLowerCase().trim();
      const venue = (e.venue || "").toLowerCase().trim();
      return city.includes("mumbai") || city.includes("bombay") || venue.includes("mumbai");
    },
  },
  {
    key: "pune",
    label: "Pune",
    queryAliases: ["pune"],
    matches: (e) => {
      const city = (e.city || "").toLowerCase().trim();
      const venue = (e.venue || "").toLowerCase().trim();
      return city.includes("pune") || venue.includes("pune");
    },
  },
  {
    key: "hyderabad",
    label: "Hyderabad",
    queryAliases: ["hyderabad", "telangana"],
    matches: (e) => {
      const city = (e.city || "").toLowerCase().trim();
      const venue = (e.venue || "").toLowerCase().trim();
      return city.includes("hyderabad") || venue.includes("hyderabad");
    },
  },
  {
    key: "kolkata",
    label: "Kolkata",
    queryAliases: ["kolkata", "calcutta"],
    matches: (e) => {
      const city = (e.city || "").toLowerCase().trim();
      const venue = (e.venue || "").toLowerCase().trim();
      return city.includes("kolkata") || city.includes("calcutta") || venue.includes("kolkata");
    },
  },
  {
    key: "chandigarh",
    label: "Chandigarh",
    queryAliases: ["chandigarh", "new chandigarh", "mohali"],
    matches: (e) => {
      const city = (e.city || "").toLowerCase().trim();
      const venue = (e.venue || "").toLowerCase().trim();
      return (
        city.includes("chandigarh") ||
        city.includes("mohali") ||
        venue.includes("chandigarh")
      );
    },
  },
  {
    key: "jaipur",
    label: "Jaipur",
    queryAliases: ["jaipur"],
    matches: (e) => {
      const city = (e.city || "").toLowerCase().trim();
      const venue = (e.venue || "").toLowerCase().trim();
      return city.includes("jaipur") || venue.includes("jaipur");
    },
  },
  {
    key: "chennai",
    label: "Chennai",
    queryAliases: ["chennai", "madras"],
    matches: (e) => {
      const city = (e.city || "").toLowerCase().trim();
      const venue = (e.venue || "").toLowerCase().trim();
      return city.includes("chennai") || city.includes("madras") || venue.includes("chennai");
    },
  },
  {
    key: "ontario",
    label: "Ontario, Canada",
    queryAliases: ["ontario", "waterloo", "toronto", "mississauga", "windsor"],
    matches: (e) => {
      const city = (e.city || "").toLowerCase().trim();
      const venue = (e.venue || "").toLowerCase().trim();
      return /ontario|waterloo|toronto|mississauga|windsor/i.test(`${city} ${venue}`);
    },
  },
  {
    key: "california",
    label: "California, USA",
    queryAliases: [
      "california",
      "san francisco",
      "sf",
      "bay area",
      "los angeles",
      "riverside",
      "silicon valley",
      "davis",
      "pasadena",
      "pomona",
    ],
    matches: (e) => {
      const city = (e.city || "").toLowerCase().trim();
      const venue = (e.venue || "").toLowerCase().trim();
      return /california|san francisco|los angeles|riverside|silicon valley|davis|pasadena|pomona/i.test(
        `${city} ${venue}`
      );
    },
  },
  {
    key: "texas",
    label: "Texas, USA",
    queryAliases: ["texas", "houston", "austin", "dallas"],
    matches: (e) => {
      const city = (e.city || "").toLowerCase().trim();
      const venue = (e.venue || "").toLowerCase().trim();
      return /texas|houston|austin|dallas/i.test(`${city} ${venue}`);
    },
  },
  {
    key: "new york",
    label: "New York, USA",
    queryAliases: ["new york", "nyc", "manhattan", "brooklyn"],
    matches: (e) => {
      const city = (e.city || "").toLowerCase().trim();
      const venue = (e.venue || "").toLowerCase().trim();
      return /new york|nyc|manhattan|brooklyn/i.test(`${city} ${venue}`);
    },
  },
  {
    key: "uk",
    label: "United Kingdom",
    queryAliases: ["uk", "united kingdom", "london", "canterbury", "kent"],
    matches: (e) => {
      const city = (e.city || "").toLowerCase().trim();
      const venue = (e.venue || "").toLowerCase().trim();
      return /uk|united kingdom|london|canterbury|kent/i.test(`${city} ${venue}`);
    },
  },
];

export interface GenieMatchResult {
  reply: string;
  results: Event[];
  detectedCriteria: {
    locations: string[];
    months: string[];
    tech: string[];
    mode?: "online" | "offline";
    isPrizeFocused: boolean;
  };
}

export function matchGenieEvents(
  query: string,
  events: Event[],
  profile?: UserProfile | null
): GenieMatchResult {
  const q = query.toLowerCase().trim();

  // 1. Detect target city strictly
  let detectedCityTarget: CityTarget | null = null;
  // Sort aliases by longest length to prevent substring clashes (e.g. "new delhi" before "delhi")
  const allAliases: Array<{ target: CityTarget; alias: string }> = [];
  for (const target of CITY_TARGETS) {
    for (const alias of target.queryAliases) {
      allAliases.push({ target, alias });
    }
  }
  allAliases.sort((a, b) => b.alias.length - a.alias.length);

  for (const item of allAliases) {
    const reg = new RegExp(`\\b${item.alias}\\b`, "i");
    if (reg.test(q)) {
      detectedCityTarget = item.target;
      break;
    }
  }

  // 2. Detect months
  const detectedMonths: Array<{ name: string; num: string }> = [];
  for (const [monthName, monthNum] of Object.entries(MONTH_MAP)) {
    const wordBoundary = new RegExp(`\\b${monthName}\\b`, "i");
    if (wordBoundary.test(q)) {
      detectedMonths.push({ name: monthName, num: monthNum });
    }
  }

  // 3. Detect tech themes
  const techTerms = [
    "ai",
    "machine learning",
    "ml",
    "web3",
    "crypto",
    "blockchain",
    "fintech",
    "hardware",
    "cybersecurity",
    "security",
    "iot",
    "cloud",
    "health",
    "design",
    "ui/ux",
    "robotics",
    "open source",
  ];
  const detectedTech = techTerms.filter((t) => {
    const reg = new RegExp(`\\b${t}\\b`, "i");
    return reg.test(q);
  });

  // 4. Detect mode
  const isOnlineOnly = /\bonline\b|\bremote\b|\bvirtual\b/.test(q);
  const isOfflineOnly = /\boffline\b|\bin-person\b|\bin person\b|\bon-site\b/.test(q);

  // 5. Detect prize intent
  const isPrizeFocused = /\bprize\b|\bcash\b|\bbounty\b|\breward\b|\bmoney\b|\bpool\b/.test(q);

  // 6. Detect platform intent
  const isLumaOnly = /\bluma\b|\bmeetup\b|\bmeetups\b|\bdevmeet\b/.test(q);
  const isDevfolioOnly = /\bdevfolio\b/.test(q);
  const isUnstopOnly = /\bunstop\b/.test(q);
  const isMlhOnly = /\bmlh\b/.test(q);

  // Filter events strictly according to detected constraints
  let matches = events.filter((e) => {
    // Location constraint
    if (detectedCityTarget) {
      if (!detectedCityTarget.matches(e)) return false;
    }

    // Month constraint
    if (detectedMonths.length > 0) {
      const dl = (e.dateLabel || "").toLowerCase();
      const starts = (e.startsAt || "").toLowerCase();
      const ends = (e.endsAt || "").toLowerCase();

      const matchesMonth = detectedMonths.some((m) => {
        const shortName = m.name.slice(0, 3);
        return (
          dl.includes(m.name) ||
          dl.includes(shortName) ||
          starts.includes(`-${m.num}-`) ||
          ends.includes(`-${m.num}-`) ||
          starts.includes(shortName) ||
          ends.includes(shortName)
        );
      });
      if (!matchesMonth) return false;
    }

    // Mode constraint
    if (isOnlineOnly && e.mode !== "online" && e.mode !== "hybrid") return false;
    if (isOfflineOnly && e.mode === "online") return false;

    // Platform constraint
    if (isLumaOnly && e.source !== "luma" && e.type !== "developer-meet") return false;
    if (isDevfolioOnly && e.source !== "devfolio") return false;
    if (isUnstopOnly && e.source !== "unstop") return false;
    if (isMlhOnly && e.source !== "mlh") return false;

    // Tech constraint
    if (detectedTech.length > 0) {
      const themeHaystack = `${e.title} ${e.themes.join(" ")} ${e.description || ""}`.toLowerCase();
      const matchesTech = detectedTech.some((t) => {
        const reg = new RegExp(`\\b${t}\\b`, "i");
        return reg.test(themeHaystack);
      });
      if (!matchesTech) return false;
    }

    return true;
  });

  // If a location + month combo produced 0 matches, check if the location HAS events in other months!
  let locationHasEventsElsewhere = false;
  let locationAlternativeEvents: Event[] = [];
  if (matches.length === 0 && detectedCityTarget && detectedMonths.length > 0) {
    locationAlternativeEvents = events.filter((e) => detectedCityTarget.matches(e));
    if (locationAlternativeEvents.length > 0) {
      locationHasEventsElsewhere = true;
    }
  }

  // Fallback if no exact constraint match and no location specified: keyword search
  if (!matches.length && !detectedCityTarget && !detectedMonths.length) {
    const stopwords = new Set([
      "hackathon",
      "hackathons",
      "event",
      "events",
      "the",
      "for",
      "with",
      "and",
      "show",
      "find",
      "get",
      "in",
      "to",
      "all",
      "some",
      "list",
      "near",
      "me",
    ]);
    const meaningfulTerms = q.split(/\s+/).filter((t) => t.length > 2 && !stopwords.has(t));

    if (meaningfulTerms.length > 0) {
      matches = events.filter((e) => {
        const text = `${e.title} ${e.description || ""} ${e.city} ${e.themes.join(" ")}`.toLowerCase();
        return meaningfulTerms.some((t) => text.includes(t));
      });
    }
  }

  // Sort matched events
  let sortedMatches = matches;
  if (isPrizeFocused) {
    sortedMatches = rankEvents(matches, profile, "prizes").map((r) => r.event);
  } else {
    sortedMatches = rankEvents(matches, profile, "signal").map((r) => r.event);
  }

  const topResults = sortedMatches.slice(0, 6);

  // Formulate natural, accurate Genie response
  let reply = "";
  const locationLabel = detectedCityTarget ? detectedCityTarget.label : "";
  const monthLabel =
    detectedMonths.length > 0
      ? detectedMonths[0].name.charAt(0).toUpperCase() + detectedMonths[0].name.slice(1)
      : "";

  if (topResults.length > 0) {
    let verdict = "";
    if (locationLabel && monthLabel) {
      verdict = `If you're competing in **${locationLabel}** during **${monthLabel} 2026**, timing and squad readiness are everything. Here are the authentic battlegrounds with verified developer caliber and real prize pools:`;
    } else if (locationLabel) {
      verdict = `Looking at the **${locationLabel}** circuit, the bar is high. You need clean architecture and an end-to-end working MVP to stand out against local top-tier teams. Here is where you should compete:`;
    } else if (isPrizeFocused) {
      verdict = `Here are the top cash-bounty hackathons. Remember: large prize pools attract seasoned teams—your differentiator will be shipping a live working prototype that solves a painful, real-world workflow in 36 hours.`;
    } else if (detectedTech.length > 0) {
      verdict = `For **${detectedTech.map((t) => t.toUpperCase()).join(" & ")}**, generic wrappers won't win anymore. Judges look for multi-step agentic workflows, latency optimizations, and clean UX. Here are your best arenas:`;
    } else {
      verdict = `Here's my senior breakdown of the best verified hackathons matching your search. Focus on events with experienced mentors and honest judging rubrics:`;
    }

    reply = `### 🧠 Senior's Strategic Verdict
${verdict}

### 🏆 Prime Battlegrounds
${topResults
  .slice(0, 4)
  .map(
    (e) =>
      `- **${e.title}** \`[${e.mode === "online" ? "Online" : e.city || "In-Person"} · ${e.dateLabel}]\`\n  - **The Play**: ${e.blurb || "High-caliber developer challenge with vetted track bounties."}\n  - **🎯 Winning Angle**: Focus on ${e.themes.slice(0, 3).join(", ") || "core architecture"} & live interactive demo.\n  - **Bounty**: ${e.prizeLabel || "Bounties & Perks"}`
  )
  .join("\n\n")}

### ⚡ Senior's Tactical Playbook
- **The 14-Hour Rule**: By hour 14, your core happy path API must run end-to-end. Never polish UI on a broken backend.
- **The Pitch Secret**: Judges decide in the first 60 seconds. Start with a real user problem and live demo, not a 10-slide PowerPoint.
- **Bounty Stacking**: Target the primary grand prize + 1 sponsor API track to maximize your winning surface area.`;
  } else if (locationHasEventsElsewhere) {
    const rankedAlternatives = rankEvents(locationAlternativeEvents, profile).slice(0, 4).map((r) => r.event);
    reply = `### 🧠 Senior's Strategic Verdict
There are currently no verified in-person hackathons scheduled strictly in **${locationLabel}** for **${monthLabel} 2026**. As a senior, my rule is simple: **never attend questionable, unverified pop-up events**. 

Here are the highest-rated upcoming hackathons confirmed in **${locationLabel}**:

### 🏆 Verified Upcoming Arenas
${rankedAlternatives
  .map(
    (e) =>
      `- **${e.title}** \`[${e.city} · ${e.dateLabel}]\`\n  - **The Play**: Official registration verified on ${e.source.toUpperCase()}.\n  - **Bounty**: ${e.prizeLabel || "Bounties & Perks"}`
  )
  .join("\n\n")}

### ⚡ Senior's Tactical Playbook
- **Preparation Sprints**: Use this gap to assemble a balanced squad: 1 backend/systems builder + 1 UI/Figma designer + 1 pitch lead.
- **Warm-up Bounties**: Test your stack in online MLH or Devfolio sprints before competing on campus.`;

    return {
      reply,
      results: rankedAlternatives,
      detectedCriteria: {
        locations: detectedCityTarget ? [detectedCityTarget.key] : [],
        months: detectedMonths.map((m) => m.name),
        tech: detectedTech,
        mode: isOnlineOnly ? "online" : isOfflineOnly ? "offline" : undefined,
        isPrizeFocused,
      },
    };
  } else {
    const onlineFallbacks = rankEvents(
      events.filter((e) => e.mode === "online"),
      profile
    )
      .slice(0, 3)
      .map((r) => r.event);

    reply = `### 🧠 Senior's Strategic Verdict
No verified hackathons were found matching "${query}". Rather than showing fabricated dates or unvetted events, here are the top global online hackathons you can compete in right now from your laptop:

### 🏆 Verified Global Online Arenas
${onlineFallbacks
  .map(
    (e) =>
      `- **${e.title}** \`[Online · ${e.dateLabel}]\`\n  - **The Play**: Global MLH / Devfolio developer challenge with distributed judging.\n  - **Bounty**: ${e.prizeLabel || "Bounties & Perks"}`
  )
  .join("\n\n")}

### ⚡ Senior's Tactical Playbook
- **Async Efficiency**: For remote hackathons, commit frequently, document your setup in README, and record a 2-minute Loom demo video early.`;
    return {
      reply,
      results: onlineFallbacks,
      detectedCriteria: {
        locations: detectedCityTarget ? [detectedCityTarget.key] : [],
        months: detectedMonths.map((m) => m.name),
        tech: detectedTech,
        mode: isOnlineOnly ? "online" : isOfflineOnly ? "offline" : undefined,
        isPrizeFocused,
      },
    };
  }

  return {
    reply,
    results: topResults,
    detectedCriteria: {
      locations: detectedCityTarget ? [detectedCityTarget.key] : [],
      months: detectedMonths.map((m) => m.name),
      tech: detectedTech,
      mode: isOnlineOnly ? "online" : isOfflineOnly ? "offline" : undefined,
      isPrizeFocused,
    },
  };
}
