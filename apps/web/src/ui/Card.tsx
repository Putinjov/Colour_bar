import React from "react";

export function Card({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={[
        "rounded-sm border-2 border-brand-line bg-brand-surface shadow-soft",
        "p-5 md:p-7",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </div>
  );
}
