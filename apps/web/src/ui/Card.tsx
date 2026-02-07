import React from "react";
export function Card({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={[
      "rounded-xl2 border border-white/10 bg-brand-paper/70 shadow-soft backdrop-blur p-4",
      className ?? ""
    ].join(" ")}>
      {children}
    </div>
  );
}
