import type { CatalogSnapshot, Event, Review, SourceStatus } from "./types";
import { INITIAL_CATALOG } from "./initialCatalog";
import { SEED_EVENTS } from "./seed";

function getEventGeoPriority(event: Event): number {
  const loc = `${event.city || ""} ${event.venue || ""} ${event.organizer?.name || ""}`;
  const title = event.title;
  const l = loc.toLowerCase();
  const t = title.toLowerCase();

  // Tier 1A: Strictly Delhi / New Delhi / East / West Delhi
  if (l.includes("delhi") || t.includes("delhi") || l.includes("janakpuri") || l.includes("ggsipu")) {
    return 2000;
  }
  // Tier 1B: Delhi-NCR (Noida, Gurugram, Ghaziabad, Faridabad)
  if (/ncr|noida|gurugram|gurgaon|ghaziabad|faridabad/.test(l) || /ncr|noida|gurugram|gurgaon|ghaziabad/.test(t)) {
    return 1500;
  }
  // Tier 2: Rest of India (Bengaluru, Mumbai, Pune, Hyderabad, Kolkata, etc.)
  const indiaLoc = `${loc} ${event.country || ""}`.toLowerCase();
  if (/india|bengaluru|bangalore|mumbai|pune|hyderabad|chennai|kolkata|nagpur|ludhiana|hamirpur|kalyani|bhubaneswar|jaipur|coimbatore|vellore/.test(indiaLoc)) {
    return 1000;
  }
  if (event.mode === "online") {
    return 500;
  }
  return 100;
}

const ALL_INITIAL_EVENTS: Event[] = (() => {
  const seen = new Set<string>();
  const list: Event[] = [];
  // Pure live scraped events only (no dummy/fake mock events)
  const combined = [...INITIAL_CATALOG.events, ...SEED_EVENTS];

  // Prioritize authentic hackathons in Delhi & India on top
  combined.sort((a, b) => getEventGeoPriority(b) - getEventGeoPriority(a));

  for (const e of combined) {
    const key = (e.id || e.slug || e.sourceUrl).toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      list.push(e);
    }
  }
  return list;
})();

export const BASE_SNAPSHOT: CatalogSnapshot = {
  ...INITIAL_CATALOG,
  events: ALL_INITIAL_EVENTS,
};

const CATALOG_KEY = "signal.catalog.v6";

let cachedRaw: string | null = null;
let cachedSnapshot: CatalogSnapshot = BASE_SNAPSHOT;
let isInitialized = false;

function readSnapshot(): CatalogSnapshot {
  if (typeof window === "undefined") {
    return BASE_SNAPSHOT;
  }

  try {
    const raw = window.localStorage.getItem(CATALOG_KEY);
    if (!isInitialized) {
      isInitialized = true;
      if (!raw) {
        // Initialize localStorage with BASE_SNAPSHOT on first run
        const serialized = JSON.stringify(BASE_SNAPSHOT);
        window.localStorage.setItem(CATALOG_KEY, serialized);
        cachedRaw = serialized;
        cachedSnapshot = BASE_SNAPSHOT;
        return cachedSnapshot;
      }
    }

    if (raw === cachedRaw) {
      return cachedSnapshot;
    }

    cachedRaw = raw;
    if (!raw) {
      cachedSnapshot = BASE_SNAPSHOT;
      return cachedSnapshot;
    }

    const parsed = JSON.parse(raw) as Partial<CatalogSnapshot>;
    if (!parsed || !Array.isArray(parsed.events) || parsed.events.length === 0) {
      cachedSnapshot = BASE_SNAPSHOT;
      return cachedSnapshot;
    }

    cachedSnapshot = {
      events: parsed.events,
      sources: Array.isArray(parsed.sources) ? parsed.sources : BASE_SNAPSHOT.sources,
      syncedAt: typeof parsed.syncedAt === "string" ? parsed.syncedAt : BASE_SNAPSHOT.syncedAt,
    };
    return cachedSnapshot;
  } catch {
    cachedRaw = null;
    cachedSnapshot = BASE_SNAPSHOT;
    return cachedSnapshot;
  }
}

export const repository = {
  subscribe: (listener: () => void): (() => void) => {
    if (typeof window === "undefined") return () => undefined;
    window.addEventListener("signal:catalog", listener);
    return () => window.removeEventListener("signal:catalog", listener);
  },

  getSnapshot: (): CatalogSnapshot => {
    return readSnapshot();
  },

  getAllEvents: (): Event[] => {
    return readSnapshot().events;
  },

  getSourceStatuses: (): SourceStatus[] => {
    return readSnapshot().sources;
  },

  getEvent: (slug: string): Event | undefined => {
    return readSnapshot().events.find((event) => event.slug === slug);
  },

  saveSnapshot: (snapshot: CatalogSnapshot): void => {
    if (typeof window !== "undefined") {
      const serialized = JSON.stringify(snapshot);
      window.localStorage.setItem(CATALOG_KEY, serialized);
      cachedRaw = serialized;
      cachedSnapshot = snapshot;
      window.dispatchEvent(new CustomEvent("signal:catalog"));
    }
  },

  mergeSnapshot: (incoming: CatalogSnapshot): CatalogSnapshot => {
    const current = readSnapshot();
    const successfulSources = new Set(
      incoming.sources
        .filter((source) => source.state === "success")
        .map((source) => source.source)
    );

    // Keep incoming events for successful sources + existing events for untouched/failing sources
    const preservedEvents = current.events.filter(
      (event) => !successfulSources.has(event.source)
    );

    const mergedEvents = [...incoming.events, ...preservedEvents];

    // Deduplicate by sourceUrl
    const seen = new Set<string>();
    const deduplicated = mergedEvents.filter((event) => {
      const key = event.sourceUrl.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const merged: CatalogSnapshot = {
      events: deduplicated,
      sources: incoming.sources,
      syncedAt: incoming.syncedAt || new Date().toISOString(),
    };

    repository.saveSnapshot(merged);
    return merged;
  },

  clearCatalog: (): void => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(CATALOG_KEY);
      cachedRaw = null;
      cachedSnapshot = INITIAL_CATALOG;
      window.dispatchEvent(new CustomEvent("signal:catalog"));
    }
  },

  getUserReviews: (): Review[] => [],
};
