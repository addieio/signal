"use client";

interface AvatarStackProps {
  goingCount: number;
  peersAttending: number;
}

const AVATAR_COLORS = [
  "from-indigo-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-orange-500",
];

const INITIALS = ["AS", "PN", "TG"];

export function AvatarStack({ goingCount, peersAttending }: AvatarStackProps) {
  return (
    <div className="flex items-center gap-2.5 text-xs text-slate-300">
      {/* Overlapping circles */}
      <div className="flex -space-x-2 overflow-hidden shrink-0">
        {AVATAR_COLORS.map((grad, i) => (
          <div
            key={i}
            className={`inline-block w-5 h-5 rounded-full ring-2 ring-surface bg-gradient-to-tr ${grad} text-[9px] font-bold text-white flex items-center justify-center`}
          >
            {INITIALS[i]}
          </div>
        ))}
      </div>

      {/* Description line */}
      <div className="truncate text-slate-300">
        <span className="font-semibold text-white">{goingCount} going</span>
        {peersAttending > 0 && (
          <span className="text-peri font-medium ml-1">
            · {peersAttending} seniors & peers attending
          </span>
        )}
      </div>
    </div>
  );
}
