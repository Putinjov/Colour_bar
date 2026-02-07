import React from "react";
export function Chip({ active, children, onClick }: React.PropsWithChildren<{ active?: boolean; onClick?: () => void }>) {
  return (
    <button
      onClick={onClick}
      className={[
        "px-3 py-2 rounded-xl2 text-xs font-semibold border transition",
        active ? "bg-brand-purple text-white border-white/10" : "bg-white/5 text-white/80 border-white/10 hover:bg-white/10"
      ].join(" ")}
    >
      {children}
    </button>
  );
}
