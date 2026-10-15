export type VibeTagCategory = "mentors" | "wifi" | "food" | "swag" | "crowd" | "venue" | "learning" | "networking" | "management";
export type VibeTagSentiment = "pos" | "neu" | "neg";
export interface VibeTag { category: VibeTagCategory; sentiment: VibeTagSentiment; label: string; }

export type EventType = "hackathon" | "developer-meet" | "workshop" | "competition" | "talk" | "cultural";
export type EventMode = "offline" | "online" | "hybrid";
export type SkillLevel = "beginner" | "intermediate" | "advanced" | "any";
export type EventSource = "devfolio" | "unstop" | "hackerearth" | "mlh" | "devpost" | "luma";
export type RegistrationStatus = "open" | "upcoming" | "closed" | "unknown";

export interface Review {
  id: string;
  author: {
    name: string;
    dept: string;
    year: number;
    college?: string;
    avatarUrl?: string;
    role?: string;
  };
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  tags: VibeTag[];
  createdAt: string;
  platform?: string;
  verifiedAttendee?: boolean;
  helpfulCount?: number;
  eventSlug?: string;
  eventTitle?: string;
}
export interface Organizer { name: string; trustScore: number; pastEventCount: number; }

/** A normalized listing. Every populated field comes from the named source. */
export interface Event {
  id: string; slug: string; source: EventSource; sourceEventId: string; sourceUrl: string;
  title: string; organizer: Organizer; type: EventType; mode: EventMode; city: string; venue: string;
  country?: string; timezone?: string; startsAt?: string; endsAt?: string; registrationClosesAt?: string;
  registrationStatus: RegistrationStatus; description?: string; eligibility?: string; teamSize?: string;
  themes: string[]; skillLevel: SkillLevel; prizeLabel?: string; bannerUrl?: string; logoUrl?: string; lastSeenAt: string;
  // Compatibility fields are intentionally empty/default for live data; they are not evidence.
  dateLabel: string; blurb: string; posterGradient: string; goingCount: number; peersAttending: number;
  reviews: Review[]; perks: string[]; imageUrl?: string; externalUrl?: string; platform?: EventSource | "campus" | "independent";
}

export interface SourceStatus { source: EventSource; label: string; state: "success" | "empty" | "unavailable" | "error"; count: number; message?: string; checkedAt: string; }
export interface CatalogSnapshot { events: Event[]; sources: SourceStatus[]; syncedAt: string; }
export interface UserProfile { name?: string; goals: string[]; interests: string[]; skillLevel: SkillLevel; formatPrefs: string[]; priorities: string[]; socialVibe: string; persona?: string; preferredLocation?: string; }
export interface RankingBreakdown { profileMatch: number; communityVibe: number; organizerTrust: number; roi: number; }
export interface RankingResult { total: number; breakdown: RankingBreakdown; reasons: string[]; }
