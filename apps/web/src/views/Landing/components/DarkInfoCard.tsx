import React from "react";

export default function DarkInfoCard({
  icon,
  title,
  text,
  delay = 0,
}: {
  icon: string;
  title: string;
  text: string;
  delay?: number;
}) {
  return (
    <div
      data-reveal="fade-left"
      data-delay={delay}
      className="rounded-sm bg-white/10 border-2 border-white/20 px-6 py-5 shadow-soft"
    >
      <div className="flex items-center gap-4">
        <div className="h-11 w-11 rounded-sm bg-brand-yellow text-brand-ink border-2 border-brand-yellow grid place-items-center text-lg">
          {icon}
        </div>
        <div>
          <div className="text-sm font-semibold text-white">{title}</div>
          <div className="text-xs text-white/60 mt-0.5">{text}</div>
        </div>
      </div>
    </div>
  );
}
