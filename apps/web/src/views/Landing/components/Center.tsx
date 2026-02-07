import React from "react";

export default function Center({ children }: React.PropsWithChildren) {
  return <div className="mx-auto max-w-7xl px-4">{children}</div>;
}