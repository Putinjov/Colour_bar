import React from "react";
export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement> & {variant?: "primary"|"ghost"|"dark"}) {
  const {variant="primary",className,...rest}=props;
  const style=variant==="ghost"?"border-black/15 bg-transparent text-brand-ink hover:bg-brand-muted":"border-transparent bg-brand-ink text-white hover:opacity-90";
  return <button className={["inline-flex min-h-[44px] items-center justify-center rounded-full border px-6 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",style,className??""].join(" ")} {...rest}/>;
}
