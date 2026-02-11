import React from "react";

export function Button(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "dark" }
) {
  const { variant = "primary", className, ...rest } = props;

  const base =
    "inline-flex items-center justify-center rounded-sm border-2 border-brand-line px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] transition active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed";

  const style =
    variant === "primary"
      ? "bg-brand-yellow text-brand-ink border-brand-yellow hover:brightness-110"
      : variant === "dark"
      ? "bg-brand-purple text-white border-brand-purple hover:brightness-110"
      : "bg-transparent text-brand-ink border-brand-line hover:bg-brand-muted";

  return <button className={[base, style, className ?? ""].join(" ")} {...rest} />;
}
