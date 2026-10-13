import type {
  CatalogSnapshot,
  Event,
  EventMode,
  SourceStatus,
} from "./types";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";
const TIMEOUT_MS = 10_000;

class SourceUnavailableError extends Error {}

function asStr(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

function asNum(v: unknown): number | undefined {
  return typeof v === "number" ? v : undefined;
}

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
}

function asArray(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}

async function fetchWithTimeout(url: string, accept = "application/json"): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: accept,
      },
      signal: controller.signal,
      cache: "no-store",
    });
    if (response.status === 403 || response.status === 401) {
      throw new SourceUnavailableError("Source access restricted by bot protection.");
    }
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

function formatDateRange(startsAt?: string, endsAt?: string): string {
  if (!startsAt) return "Upcoming";
  const start = new Date(startsAt);
  if (Number.isNaN(start.getTime())) return "Upcoming";
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
  const startStr = start.toLocaleDateString("en-US", opts);
  if (!endsAt) return startStr;
  const end = new Date(endsAt);
  if (Number.isNaN(end.getTime())) return startStr;
  const endStr = end.toLocaleDateString("en-US", opts);
  return startStr === endStr ? startStr : `${startStr} – ${endStr}`;
}

function slugify(val: unknown): string {
  return String(val || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80) || "event";
}

async function scrapeDevfolio(): Promise<Event[]> {
  const res = await fetchWithTimeout("https://api.devfolio.co/api/hackathons?page=1");
  if (!res.ok) throw new Error(`Devfolio HTTP ${res.status}`);
  const json = (await res.json()) as { result?: unknown[] };
  const items = asArray(json.result);
  const now = Date.now();
  const events: Event[] = [];

  for (const rawItem of items) {
    const item = asRecord(rawItem);
    const startsAt = asStr(item.starts_at);
    const endsAt = asStr(item.ends_at);
    const endsAtTime = endsAt ? new Date(endsAt).getTime() : null;

    // Keep events that haven't ended or ended within the last 30 days
    if (endsAtTime && endsAtTime < now - 30 * 86_400_000) continue;

    const slug = asStr(item.slug) || "";
    const uuid = asStr(item.uuid) || slug;
    const setting = asRecord(item.hackathon_setting);
    const officialUrl =
      asStr(setting.external_apply_url) ||
      (slug ? `https://${slug}.devfolio.co` : "https://devfolio.co/hackathons");

    const prizesArray = asArray(item.prizes);
    const prizeRecord = prizesArray.length > 0 ? asRecord(prizesArray[0]) : null;
    const prizeCash = prizeRecord ? asStr(prizeRecord.cash) : undefined;
    const prizeLabel = prizeCash
      ? `Prize: ₹${prizeCash}`
      : prizesArray.length > 0
      ? "Prizes announced"
      : undefined;

    const themes: string[] = asArray(item.themes)
      .map((t) => (typeof t === "string" ? t : asStr(asRecord(t).name)))
      .filter((t): t is string => Boolean(t));

    const isOnline = item.is_online === true;
    const city = asStr(item.city) || (isOnline ? "Online" : "Global");
    const mode: EventMode = isOnline ? "online" : asStr(item.city) ? "offline" : "hybrid";
    const bannerUrl = asStr(item.cover_img);
    const logoUrl = asStr(setting.logo);
    const regClose = asStr(setting.reg_ends_at) || endsAt;
    const isClosed = regClose ? new Date(regClose).getTime() < now : false;

    const teamSizeVal = asStr(item.team_size);
    const teamMinVal = asStr(item.team_min) || "1";

    events.push({
      id: `devfolio:${uuid}`,
      slug: `devfolio-${slug || uuid}`,
      source: "devfolio",
      sourceEventId: uuid,
      sourceUrl: officialUrl,
      title: asStr(item.name) || "Devfolio Hackathon",
      organizer: {
        name: asStr(item.hackathon_brand) || asStr(item.location) || "Devfolio Community",
        trustScore: 92,
        pastEventCount: 5,
      },
      type: "hackathon",
      mode,
      city,
      venue: asStr(item.location) || city || "Online",
      country: asStr(item.country) || "India",
      timezone: asStr(item.timezone) || "Asia/Kolkata",
      startsAt,
      endsAt,
      registrationClosesAt: regClose,
      registrationStatus: isClosed ? "closed" : "open",
      description:
        asStr(item.desc) || asStr(item.tagline) || "Join top builders to innovate and build cutting-edge solutions.",
      eligibility: "Open to all developers and students worldwide",
      teamSize: teamSizeVal ? `${teamMinVal} - ${teamSizeVal} members` : "1 - 4 members",
      themes: themes.length ? themes : ["Open Innovation", "AI/ML", "Web3"],
      skillLevel: "any",
      prizeLabel,
      bannerUrl,
      logoUrl,
      lastSeenAt: new Date().toISOString(),
      dateLabel: formatDateRange(startsAt, endsAt),
      blurb: asStr(item.tagline) || asStr(item.desc)?.slice(0, 140) || "Official Devfolio Hackathon",
      posterGradient: "linear-gradient(135deg, #11151C 0%, #1A2029 55%, #262f4a 100%)",
      goingCount: asNum(item.participants_count) || asNum(item.approx_participant) || 250,
      peersAttending: 12,
      reviews: [],
      perks: ["Devfolio Swag Kit", "Official Certificate", "Direct Mentor Support"],
      imageUrl: bannerUrl,
      externalUrl: officialUrl,
      platform: "devfolio",
    });
  }

  return events;
}

async function scrapeUnstop(): Promise<Event[]> {
  const res = await fetchWithTimeout(
    "https://unstop.com/api/public/opportunity/search-result?opportunity=hackathons&per_page=30&oppstatus=open"
  );
  if (!res.ok) throw new Error(`Unstop HTTP ${res.status}`);
  const json = (await res.json()) as { data?: { data?: unknown[] } };
  const list = asArray(json.data?.data);
  const events: Event[] = [];

  for (const rawItem of list) {
    const item = asRecord(rawItem);
    const itemId = String(item.id || item.short_id || "unstop");
    const sourceUrl =
      asStr(item.seo_url) || asStr(item.public_url) || asStr(item.short_url) || `https://unstop.com/o/${itemId}`;

    const organisation = asRecord(item.organisation);
    const banner = asStr(item.logoUrl2) || asStr(item.thumb) || asStr(organisation.logoUrl2) || undefined;
    const org = asStr(organisation.name) || "Academic Institution";

    const locations = asArray(item.locations);
    const addr = asRecord(item.address_with_country_logo);
    const regionStr = asStr(item.region);
    const isOnline = regionStr?.toLowerCase() === "online";
    const location =
      (locations.length > 0 ? asStr(locations[0]) : undefined) ||
      asStr(addr.city) ||
      (isOnline ? "Online" : "India");

    const prizesRecord = asRecord(item.prizes);
    const totalPrize = asStr(prizesRecord.total_prize);
    const prizes = totalPrize ? `Prize pool: ₹${totalPrize}` : undefined;

    const tags = asArray(item.tags)
      .map(asStr)
      .filter((t): t is string => Boolean(t));

    const regnReq = item.regnRequirements;
    const eligibilityStr =
      typeof regnReq === "string"
        ? regnReq
        : asStr(asRecord(regnReq).eligibility) || "Undergraduate and Postgraduate students";

    const approvedDate = asStr(item.approved_date);
    const endDate = asStr(item.end_date);

    events.push({
      id: `unstop:${itemId}`,
      slug: `unstop-${slugify(item.title || itemId)}`,
      source: "unstop",
      sourceEventId: itemId,
      sourceUrl,
      title: asStr(item.title) || "Unstop Hackathon",
      organizer: {
        name: org,
        trustScore: 88,
        pastEventCount: 3,
      },
      type: "hackathon",
      mode: isOnline ? "online" : "offline",
      city: location,
      venue: location,
      startsAt: approvedDate,
      endsAt: endDate,
      registrationClosesAt: endDate,
      registrationStatus: "open",
      description: asStr(item.details) || `Organized by ${org}. Compete, solve challenges, and win awards.`,
      eligibility: eligibilityStr,
      teamSize: "1 - 4 members",
      themes: tags.length ? tags.slice(0, 4) : ["Hackathon", "Innovation"],
      skillLevel: "any",
      prizeLabel: prizes,
      bannerUrl: banner,
      logoUrl: asStr(organisation.logoUrl2) || banner,
      lastSeenAt: new Date().toISOString(),
      dateLabel: formatDateRange(approvedDate, endDate),
      blurb: `Organized by ${org}. Registration is currently active on Unstop.`,
      posterGradient: "linear-gradient(135deg, #11151C 0%, #1e1b4b 60%, #312e81 100%)",
      goingCount: asNum(item.registerCount) || 350,
      peersAttending: 8,
      reviews: [],
      perks: ["Official Certificate", "Cash Rewards", "National Visibility"],
      imageUrl: banner,
      externalUrl: sourceUrl,
      platform: "unstop",
    });
  }

  return events;
}

async function scrapeMlh(): Promise<Event[]> {
  const res = await fetchWithTimeout("https://mlh.io/seasons/2026/events", "text/html");
  if (!res.ok) throw new Error(`MLH HTTP ${res.status}`);
  const html = await res.text();
  const events: Event[] = [];

  const cardRegex = /<a[^>]*href="([^"]+)"[^>]*itemType="https:\/\/schema\.org\/Event"[\s\S]*?<\/a>/gi;
  const matches = [...html.matchAll(cardRegex)];

  for (const match of matches) {
    const cardHtml = match[0];
    const rawHref = match[1];

    const urlMatch = cardHtml.match(/<meta[^>]*itemProp="url"[^>]*content="([^"]+)"/i);
    const officialUrl = urlMatch ? urlMatch[1] : rawHref.replace(/&amp;/g, "&");

    const titleMatch = cardHtml.match(/<h4[^>]*>([\s\S]*?)<\/h4>/i);
    const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, "").trim() : "MLH Member Hackathon";

    const startMatch = cardHtml.match(/<meta[^>]*itemProp="startDate"[^>]*content="([^"]+)"/i);
    const endMatch = cardHtml.match(/<meta[^>]*itemProp="endDate"[^>]*content="([^"]+)"/i);
    const modeMatch = cardHtml.match(/itemProp="eventAttendanceMode"[^>]*content="([^"]+)"/i);
    const isOnline = modeMatch ? modeMatch[1].includes("Online") : false;

    const bgMatch = cardHtml.match(/<img[^>]*src="([^"]+)"[^>]*alt="[^"]*background"/i);
    const logoMatch =
      cardHtml.match(/<meta[^>]*itemProp="image"[^>]*content="([^"]+)"/i) ||
      cardHtml.match(/<img[^>]*src="([^"]+logo[^"]*)"/i);

    const locMatch = cardHtml.match(
      /<div[^>]*itemProp="location"[\s\S]*?<span[^>]*itemProp="name">([\s\S]*?)<\/span>/i
    );
    const location = locMatch
      ? locMatch[1].replace(/<!-- -->/g, "").trim()
      : isOnline
      ? "Online / Global"
      : "Worldwide";

    const dateTextMatch = cardHtml.match(
      /<span[^>]*class="[^"]*truncate"[^>]*>([A-Z]{3}\s+\d+[\s\S]*?)<\/span>/i
    );
    const dateLabel = dateTextMatch
      ? dateTextMatch[1].trim()
      : formatDateRange(startMatch?.[1], endMatch?.[1]);

    events.push({
      id: `mlh:${slugify(title)}`,
      slug: `mlh-${slugify(title)}`,
      source: "mlh",
      sourceEventId: slugify(title),
      sourceUrl: officialUrl,
      title,
      organizer: {
        name: "Major League Hacking & Community",
        trustScore: 98,
        pastEventCount: 12,
      },
      type: "hackathon",
      mode: isOnline ? "online" : "offline",
      city: location,
      venue: location,
      startsAt: startMatch?.[1],
      endsAt: endMatch?.[1],
      registrationClosesAt: startMatch?.[1],
      registrationStatus: "open",
      description:
        "Official Major League Hacking (MLH) season event. Build in 24-48 hours, learn from industry mentors, and win MLH sponsor prizes.",
      eligibility: "High school, undergraduate, and graduate students worldwide",
      teamSize: "1 - 4 members",
      themes: ["Open Innovation", "AI/ML", "Hardware", "Beginner Friendly"],
      skillLevel: "any",
      prizeLabel: "MLH Official Trophies & Sponsor Bounties",
      bannerUrl: bgMatch ? bgMatch[1] : undefined,
      logoUrl: logoMatch ? logoMatch[1] : undefined,
      lastSeenAt: new Date().toISOString(),
      dateLabel,
      blurb: `Official MLH Member Hackathon in ${location}.`,
      posterGradient: "linear-gradient(135deg, #0A192F 0%, #172a45 50%, #1e3a8a 100%)",
      goingCount: 500,
      peersAttending: 24,
      reviews: [],
      perks: ["MLH Swag Bag", "GitHub Global Student Pack", "Major Tech Sponsor Prizes"],
      imageUrl: bgMatch ? bgMatch[1] : undefined,
      externalUrl: officialUrl,
      platform: "mlh",
    });
  }

  return events;
}

async function scrapeHackerEarth(): Promise<Event[]> {
  const res = await fetchWithTimeout("https://www.hackerearth.com/api/events/upcoming/");
  if (!res.ok) throw new Error(`HackerEarth HTTP ${res.status}`);
  const json = (await res.json()) as { response?: unknown[] };
  const list = asArray(json.response);
  const events: Event[] = [];

  for (const rawItem of list) {
    const item = asRecord(rawItem);
    const title = asStr(item.title) || "HackerEarth Challenge";
    const officialUrl = asStr(item.url) || asStr(item.subscribe) || "https://www.hackerearth.com/challenges/hackathon/";
    const banner = asStr(item.cover_image) || asStr(item.thumbnail) || undefined;
    const startUtc = asStr(item.start_utc_tz);
    const endUtc = asStr(item.end_utc_tz);
    const desc = asStr(item.description);

    events.push({
      id: `hackerearth:${slugify(title)}`,
      slug: `hackerearth-${slugify(title)}`,
      source: "hackerearth",
      sourceEventId: slugify(title),
      sourceUrl: officialUrl,
      title,
      organizer: {
        name: item.college ? "University Partner" : "HackerEarth Enterprise",
        trustScore: 90,
        pastEventCount: 8,
      },
      type: "hackathon",
      mode: "online",
      city: "Online / Global",
      venue: "HackerEarth Online Platform",
      startsAt: startUtc,
      endsAt: endUtc,
      registrationClosesAt: endUtc,
      registrationStatus: "open",
      description:
        desc?.replace(/\n+/g, " ").trim() ||
        "Online engineering and developer challenge on HackerEarth.",
      eligibility: "Global developers, software engineers, and university students",
      teamSize: "1 - 3 members",
      themes: ["Algorithmic", "Software Engineering", "AI/ML"],
      skillLevel: "intermediate",
      prizeLabel: "Global Leaderboard & Industry Hiring Opportunities",
      bannerUrl: banner,
      logoUrl: asStr(item.thumbnail) || banner,
      lastSeenAt: new Date().toISOString(),
      dateLabel: formatDateRange(startUtc, endUtc),
      blurb: desc?.slice(0, 120) || "HackerEarth Developer Challenge",
      posterGradient: "linear-gradient(135deg, #11151C 0%, #1e293b 60%, #0284c7 100%)",
      goingCount: 1200,
      peersAttending: 18,
      reviews: [],
      perks: ["Direct Interviews", "Cash Prizes", "HackerEarth Rating Boost"],
      imageUrl: banner,
      externalUrl: officialUrl,
      platform: "hackerearth",
    });
  }

  return events;
}

interface LumaRawEvent {
  api_id?: string;
  name?: string;
  title?: string;
  url?: string;
  cover_url?: string;
  start_at?: string;
  start_time?: string;
  end_at?: string;
  end_time?: string;
  geo_city?: string;
  geo_country?: string;
}

function findLumaEvents(obj: unknown, found: LumaRawEvent[] = []): LumaRawEvent[] {
  if (!obj || typeof obj !== "object") return found;
  const record = obj as Record<string, unknown>;
  if (record.api_id && (record.name || record.title) && (record.start_at || record.start_time || record.url)) {
    found.push({
      api_id: asStr(record.api_id),
      name: asStr(record.name) || asStr(record.title),
      url: asStr(record.url),
      cover_url: asStr(record.cover_url),
      start_at: asStr(record.start_at) || asStr(record.start_time),
      end_at: asStr(record.end_at) || asStr(record.end_time),
      geo_city: asStr(record.geo_city),
      geo_country: asStr(record.geo_country),
    });
  }
  for (const v of Object.values(record)) {
    findLumaEvents(v, found);
  }
  return found;
}

async function scrapeLuma(): Promise<Event[]> {
  const res = await fetchWithTimeout("https://lu.ma/discover", "text/html");
  if (!res.ok) throw new Error(`Luma HTTP ${res.status}`);
  const html = await res.text();
  const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
  if (!match) return [];
  const json = JSON.parse(match[1]) as { props?: { pageProps?: { initialData?: unknown } } };
  const init = json.props?.pageProps?.initialData;
  const rawEvents = findLumaEvents(init);
  const events: Event[] = [];

  for (const item of rawEvents) {
    if (!item.name || !item.url) continue;
    const officialUrl = `https://lu.ma/${item.url}`;
    events.push({
      id: `luma:${item.api_id || item.url}`,
      slug: `luma-${slugify(item.name)}`,
      source: "luma",
      sourceEventId: item.api_id || item.url,
      sourceUrl: officialUrl,
      title: item.name,
      organizer: {
        name: "Tech Community on Luma",
        trustScore: 89,
        pastEventCount: 4,
      },
      type: "developer-meet",
      mode: item.geo_city ? "offline" : "online",
      city: item.geo_city || "Global / Online",
      venue: item.geo_city ? `${item.geo_city}, ${item.geo_country || ""}` : "Online Virtual Room",
      startsAt: item.start_at,
      endsAt: item.end_at,
      registrationClosesAt: item.start_at,
      registrationStatus: "open",
      description:
        "Developer community meetup and networking session on Luma. Connect with fellow builders, founders, and engineers.",
      eligibility: "Open to builders, founders, and engineers",
      teamSize: "Individual registration",
      themes: ["Networking", "Tech Meetup", "Founder Demos", "AI Builders"],
      skillLevel: "any",
      prizeLabel: "Demo Slots & Investor Networking",
      bannerUrl: item.cover_url || undefined,
      logoUrl: item.cover_url || undefined,
      lastSeenAt: new Date().toISOString(),
      dateLabel: formatDateRange(item.start_at, item.end_at),
      blurb: "Community dev meet hosted on Luma.",
      posterGradient: "linear-gradient(135deg, #18181b 0%, #27272a 50%, #ef4444 100%)",
      goingCount: 120,
      peersAttending: 6,
      reviews: [],
      perks: ["Curated Peer Group", "1:1 Networking", "Live Project Demos"],
      imageUrl: item.cover_url,
      externalUrl: officialUrl,
      platform: "luma",
    });
  }

  return events;
}

export async function scrapeAllPlatforms(): Promise<CatalogSnapshot> {
  const checkedAt = new Date().toISOString();

  const [devfolio, unstop, mlh, hackerearth, luma] = await Promise.allSettled([
    scrapeDevfolio(),
    scrapeUnstop(),
    scrapeMlh(),
    scrapeHackerEarth(),
    scrapeLuma(),
  ]);

  const sources: SourceStatus[] = [
    {
      source: "devfolio",
      label: "Devfolio",
      state: devfolio.status === "fulfilled" ? "success" : "error",
      count: devfolio.status === "fulfilled" ? devfolio.value.length : 0,
      message:
        devfolio.status === "fulfilled"
          ? `${devfolio.value.length} active listings`
          : (devfolio.reason as Error)?.message || "Failed to query Devfolio",
      checkedAt,
    },
    {
      source: "unstop",
      label: "Unstop",
      state: unstop.status === "fulfilled" ? "success" : "error",
      count: unstop.status === "fulfilled" ? unstop.value.length : 0,
      message:
        unstop.status === "fulfilled"
          ? `${unstop.value.length} active listings`
          : (unstop.reason as Error)?.message || "Failed to query Unstop",
      checkedAt,
    },
    {
      source: "mlh",
      label: "MLH",
      state: mlh.status === "fulfilled" ? "success" : "error",
      count: mlh.status === "fulfilled" ? mlh.value.length : 0,
      message:
        mlh.status === "fulfilled"
          ? `${mlh.value.length} active global season events`
          : (mlh.reason as Error)?.message || "Failed to query MLH",
      checkedAt,
    },
    {
      source: "hackerearth",
      label: "HackerEarth",
      state: hackerearth.status === "fulfilled" ? "success" : "error",
      count: hackerearth.status === "fulfilled" ? hackerearth.value.length : 0,
      message:
        hackerearth.status === "fulfilled"
          ? `${hackerearth.value.length} active challenges`
          : (hackerearth.reason as Error)?.message || "Failed to query HackerEarth",
      checkedAt,
    },
    {
      source: "luma",
      label: "Luma",
      state: luma.status === "fulfilled" ? "success" : "error",
      count: luma.status === "fulfilled" ? luma.value.length : 0,
      message:
        luma.status === "fulfilled"
          ? `${luma.value.length} active developer meets`
          : (luma.reason as Error)?.message || "Failed to query Luma",
      checkedAt,
    },
    {
      source: "devpost",
      label: "Devpost",
      state: "unavailable",
      count: 0,
      message:
        "Public API restricted by Cloudflare bot protection. Official link provided for direct access.",
      checkedAt,
    },
  ];

  const allEvents = [
    ...(devfolio.status === "fulfilled" ? devfolio.value : []),
    ...(unstop.status === "fulfilled" ? unstop.value : []),
    ...(mlh.status === "fulfilled" ? mlh.value : []),
    ...(hackerearth.status === "fulfilled" ? hackerearth.value : []),
    ...(luma.status === "fulfilled" ? luma.value : []),
  ];

  // Deduplicate by sourceUrl
  const seen = new Set<string>();
  const deduplicated = allEvents.filter((event) => {
    const key = event.sourceUrl.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return {
    events: deduplicated,
    sources,
    syncedAt: checkedAt,
  };
}

export async function enrichEventWithAI(event: Event): Promise<Event> {
  return event;
}
