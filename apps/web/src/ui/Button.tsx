import React from "react";
export function Button(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" }
) {
  const { variant = "primary", className, ...rest } = props;
  const base = "inline-flex items-center justify-center rounded-xl2 px-4 py-3 text-sm font-semibold transition active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed";
  const style =
    variant === "primary"
      ? "bg-brand-yellow text-brand-ink hover:brightness-105"
      : "bg-white/5 text-white border border-white/10 hover:bg-white/10";
  return <button className={[base, style, className ?? ""].join(" ")} {...rest} />;
}
