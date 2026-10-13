"use client";

import { useMemo } from "react";
import { Calendar, Download, ExternalLink } from "lucide-react";
import type { Event } from "@/lib/types";

interface GoogleCalendarButtonProps {
  event: Event;
  variant?: "button" | "compact" | "icon";
  className?: string;
}

function formatGoogleDate(date: Date): string {
  return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
}

export function GoogleCalendarButton({
  event,
  variant = "button",
  className = "",
}: GoogleCalendarButtonProps) {
  const googleCalendarUrl = useMemo(() => {
    // Determine start date
    let startDate = event.startsAt ? new Date(event.startsAt) : new Date();
    // If startDate is invalid, default to tomorrow
    if (isNaN(startDate.getTime())) {
      startDate = new Date(Date.now() + 86400000);
    }

    // Determine end date
    let endDate = event.endsAt ? new Date(event.endsAt) : null;
    if (!endDate || isNaN(endDate.getTime())) {
      // Default duration: 36 hours for hackathons
      endDate = new Date(startDate.getTime() + 36 * 60 * 60 * 1000);
    }

    const datesParam = `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`;
    const titleParam = encodeURIComponent(event.title);
    const locationParam = encodeURIComponent(
      event.venue || event.city || (event.mode === "online" ? "Virtual / Online" : "TBA")
    );

    const detailsText = [
      `Hackathon: ${event.title}`,
      `Organized by: ${event.organizer.name}`,
      `Format: ${event.mode === "online" ? "Online / Virtual" : "In-Person"} (${event.city || ""})`,
      `Official Website: ${event.sourceUrl}`,
      event.prizeLabel ? `Prize Pool: ${event.prizeLabel}` : "",
      event.registrationClosesAt
        ? `Registration Closes: ${new Date(event.registrationClosesAt).toLocaleDateString()}`
        : "",
      "",
      event.blurb || "",
    ]
      .filter(Boolean)
      .join("\n");

    const detailsParam = encodeURIComponent(detailsText);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titleParam}&dates=${datesParam}&details=${detailsParam}&location=${locationParam}&sf=true&output=xml`;
  }, [event]);

  if (variant === "compact") {
    return (
      <a
        href={googleCalendarUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Add to Google Calendar"
        className={`inline-flex items-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-300 hover:bg-blue-500/20 transition cursor-pointer ${className}`}
      >
        <Calendar className="h-3.5 w-3.5 text-blue-400" />
        <span>Add to GCal</span>
      </a>
    );
  }

  if (variant === "icon") {
    return (
      <a
        href={googleCalendarUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Add to Google Calendar"
        className={`inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-white/10 bg-surface2 text-muted hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-blue-300 transition cursor-pointer shrink-0 ${className}`}
      >
        <Calendar className="h-4 w-4" />
      </a>
    );
  }

  // Default Button variant
  return (
    <a
      href={googleCalendarUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-blue-500/40 bg-blue-500/10 px-5 text-sm font-bold text-blue-300 hover:bg-blue-500/20 transition shadow-md shadow-blue-500/10 cursor-pointer ${className}`}
    >
      <Calendar className="h-4 w-4 text-blue-400" />
      <span>Add to Google Calendar</span>
      <ExternalLink className="h-3.5 w-3.5 opacity-70" />
    </a>
  );
}
