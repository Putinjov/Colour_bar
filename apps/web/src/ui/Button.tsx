import React from "react";

export function Button(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "dark" }
) {
  const { variant = "primary", className, ...rest } = props;

  const base =
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed";

  const style =
    variant === "primary"
      ? "bg-brand-ink text-white hover:opacity-90"
      : variant === "dark"
      ? "bg-brand-purple text-white hover:opacity-90"
      : "bg-transparent text-brand-ink border border-brand-line hover:bg-brand-muted";

  return <button className={[base, style, className ?? ""].join(" ")} {...rest} />;
}
