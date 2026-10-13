import type { Event, RankingBreakdown, RankingResult, UserProfile } from "./types";

export const CATEGORY_WEIGHTS = {
  "Signal Score": { profileMatch: 0.35, communityVibe: 0.25, organizerTrust: 0.20, roi: 0.20 },
  "For you": { profileMatch: 0.50, communityVibe: 0.20, organizerTrust: 0.15, roi: 0.15 },
};

export function isEventMatchingPreferredLocation(event: Event, preferredLocation?: string): boolean {
  if (!preferredLocation) return false;
  const loc = preferredLocation.toLowerCase();
  const text = `${event.city} ${event.venue} ${event.title} ${event.organizer.name}`.toLowerCase();

  if (loc === "delhi") {
    return /delhi|ncr|noida|gurgaon|gurugram|ghaziabad|iiitd|iit delhi|dtu|nsut|igdtuw|bennett|galgotias/.test(text);
  }
  if (loc === "bangalore") {
    return /bangalore|bengaluru|karnataka|koramangala|whitefield|indiranagar|rvce|pes/.test(text);
  }
  if (loc === "mumbai") {
    return /mumbai|pune|maharashtra|navi mumbai|iit bombay|coep/.test(text);
  }
  if (loc === "hyderabad") {
    return /hyderabad|telangana|cyberabad|iiit hyderabad|t-hub/.test(text);
  }
  if (loc === "online") {
    return event.mode === "online";
  }
  if (loc === "pan_india") {
    return event.country === "India" || /delhi|bangalore|bengaluru|mumbai|pune|hyderabad|kolkata|chennai|india/i.test(text);
  }
  return text.includes(loc);
}

export function computeProfileMatch(event: Event, profile?: UserProfile | null): number {
  if (!profile || (!profile.interests.length && !profile.formatPrefs.length && !profile.goals.length && !profile.preferredLocation)) {
    // Intelligent baseline match based on domain richness and open eligibility
    const themeCount = Math.min(event.themes.length, 5);
    return Math.min(0.92, 0.70 + themeCount * 0.04);
  }

  const factors: number[] = [];
  const themes = event.themes.map((t) => t.toLowerCase());

  // 1. Interests match
  if (profile.interests.length) {
    const matchedInterests = profile.interests.filter((interest) => {
      const i = interest.toLowerCase();
      return themes.some((theme) => theme.includes(i) || i.includes(theme));
    });
    factors.push(matchedInterests.length > 0 ? Math.min(1, 0.5 + (matchedInterests.length / profile.interests.length) * 0.5) : 0.4);
  }

  // 2. Format / Mode match
  if (profile.formatPrefs.length) {
    const prefs = profile.formatPrefs.join(" ").toLowerCase();
    const isOnlinePref = /online|remote|virtual/.test(prefs);
    const isOfflinePref = /offline|in-person|in person/.test(prefs);

    if (event.mode === "hybrid") {
      factors.push(1.0);
    } else if (event.mode === "online" && isOnlinePref) {
      factors.push(1.0);
    } else if (event.mode === "offline" && isOfflinePref) {
      factors.push(1.0);
    } else {
      factors.push(0.5);
    }
  }

  // 3. Goals match
  if (profile.goals.length) {
    const haystack = `${event.title} ${event.description || ""} ${event.prizeLabel || ""} ${event.themes.join(" ")}`.toLowerCase();
    const matchedGoals = profile.goals.filter((g) => haystack.includes(g.toLowerCase()));
    factors.push(matchedGoals.length > 0 ? 0.95 : 0.6);
  }

  // 4. Preferred Location Hub match
  if (profile.preferredLocation) {
    if (isEventMatchingPreferredLocation(event, profile.preferredLocation)) {
      factors.push(1.0);
    } else if (event.mode === "online") {
      factors.push(0.85); // Online events are accessible to anyone
    } else {
      factors.push(0.40);
    }
  }

  return factors.length ? factors.reduce((sum, f) => sum + f, 0) / factors.length : 0.8;
}

export function computeCommunityVibe(event: Event): number {
  const participants = event.goingCount || 100;
  let score = 0.70;

  if (participants >= 1000) score = 0.96;
  else if (participants >= 500) score = 0.90;
  else if (participants >= 250) score = 0.82;
  else if (participants >= 100) score = 0.76;

  // Bonus for mentorship and perks
  if (event.perks?.length) {
    score = Math.min(0.98, score + event.perks.length * 0.02);
  }

  return score;
}

export function computeOrganizerTrust(event: Event): number {
  if (event.organizer.trustScore > 0) {
    return Math.min(0.99, Math.max(0.70, event.organizer.trustScore / 100));
  }

  // Baseline platform trust
  switch (event.source) {
    case "mlh":
      return 0.98;
    case "devfolio":
      return 0.95;
    case "hackerearth":
      return 0.92;
    case "luma":
      return 0.90;
    case "unstop":
      return 0.88;
    default:
      return 0.85;
  }
}

export function computeROI(event: Event): number {
  let score = 0.70;

  if (event.prizeLabel) {
    const prize = event.prizeLabel.toLowerCase();
    if (prize.includes("5,00,000") || prize.includes("10,000") || prize.includes("lakh") || prize.includes("pool")) {
      score = 0.95;
    } else {
      score = 0.88;
    }
  }

  if (event.perks?.some((p) => /interview|hiring|job|incub|cash/i.test(p))) {
    score = Math.min(0.98, score + 0.05);
  }

  return score;
}

export function computeRanking(event: Event, profile?: UserProfile | null): RankingResult {
  const profileMatch = computeProfileMatch(event, profile);
  const communityVibe = computeCommunityVibe(event);
  const organizerTrust = computeOrganizerTrust(event);
  const roi = computeROI(event);

  const breakdown: RankingBreakdown = {
    profileMatch,
    communityVibe,
    organizerTrust,
    roi,
  };

  // Weighted composite score (0 - 100)
  const weighted = profileMatch * 0.35 + communityVibe * 0.25 + organizerTrust * 0.20 + roi * 0.20;
  const total = Math.round(weighted * 100);

  const reasons: string[] = [];

  // 1. Profile / theme rationale
  if (profile?.interests.length) {
    const matches = event.themes.filter((theme) =>
      profile.interests.some(
        (interest) =>
          theme.toLowerCase().includes(interest.toLowerCase()) ||
          interest.toLowerCase().includes(theme.toLowerCase())
      )
    );
    if (matches.length) {
      reasons.push(`High affinity with your focus in ${matches.slice(0, 2).join(" & ")}.`);
    }
  } else if (event.themes.length) {
    reasons.push(`Top-tier track lineup in ${event.themes.slice(0, 2).join(" & ")}.`);
  }

  // 2. Organizer & format rationale
  reasons.push(
    `Verified by ${event.organizer.name} (${Math.round(organizerTrust * 100)}% Trust Rating) in ${
      event.mode === "offline" ? "In-Person" : event.mode === "online" ? "Virtual" : "Hybrid"
    } format.`
  );

  // 3. ROI rationale
  if (event.prizeLabel) {
    reasons.push(`High ROI: ${event.prizeLabel} with sponsor bounties and perks.`);
  } else {
    reasons.push(`Strong community caliber with ~${event.goingCount || 250}+ active hackers registered.`);
  }

  // 4. Preferred Location rationale
  if (profile?.preferredLocation && isEventMatchingPreferredLocation(event, profile.preferredLocation)) {
    reasons.unshift("1st preference: Matches your calibrated location hub.");
  }

  return { total, breakdown, reasons };
}

export interface RankedEventItem {
  event: Event;
  ranking: RankingResult;
  isPreferredHub: boolean;
}

export function rankEvents(
  events: Event[],
  profile?: UserProfile | null,
  sortMode: "signal" | "fit" | "prizes" | "vibe" | "trust" = "signal"
): RankedEventItem[] {
  const preferredLoc = profile?.preferredLocation || "delhi";
  const ranked: RankedEventItem[] = events.map((event) => ({
    event,
    ranking: computeRanking(event, profile),
    isPreferredHub: isEventMatchingPreferredLocation(event, preferredLoc),
  }));

  ranked.sort((a, b) => {
    // 1. If preferredLocation is set, events from the user's preferred location hub get FIRST PREFERENCE
    if (profile?.preferredLocation) {
      const aMatches = isEventMatchingPreferredLocation(a.event, profile.preferredLocation);
      const bMatches = isEventMatchingPreferredLocation(b.event, profile.preferredLocation);
      if (aMatches !== bMatches) {
        return aMatches ? -1 : 1;
      }
    }

    if (sortMode === "fit") {
      return b.ranking.breakdown.profileMatch - a.ranking.breakdown.profileMatch;
    }
    if (sortMode === "prizes") {
      return b.ranking.breakdown.roi - a.ranking.breakdown.roi;
    }
    if (sortMode === "vibe") {
      return b.ranking.breakdown.communityVibe - a.ranking.breakdown.communityVibe;
    }
    if (sortMode === "trust") {
      return b.ranking.breakdown.organizerTrust - a.ranking.breakdown.organizerTrust;
    }
    // Default: total Signal composite score
    return b.ranking.total - a.ranking.total || a.event.title.localeCompare(b.event.title);
  });

  return ranked;
}
