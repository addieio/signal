"use client";

interface MicroLabelProps {
  organizer: string;
  type: string;
  mode: string;
  city?: string;
}

export function MicroLabel({ organizer, type, mode, city }: MicroLabelProps) {
  const parts = [
    organizer.toUpperCase(),
    type.toUpperCase(),
    mode.toUpperCase(),
  ];

  if (city && city.toLowerCase() !== "delhi") {
    parts.push(city.toUpperCase());
  }

  return (
    <div className="text-[11px] uppercase font-mono tracking-wider text-slate-500 font-semibold flex items-center gap-1.5 flex-wrap">
      {parts.map((p, idx) => (
        <span key={idx} className="flex items-center gap-1.5">
          <span>{p}</span>
          {idx < parts.length - 1 && <span className="opacity-40 text-slate-400">·</span>}
        </span>
      ))}
    </div>
  );
}
