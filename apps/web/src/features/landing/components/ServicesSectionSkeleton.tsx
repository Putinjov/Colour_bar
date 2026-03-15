import React from "react";
import Center from "../../../views/Landing/components/Center.js";

export default function ServicesSectionSkeleton() {
  return (
    <section id="services" style={{ background: "#F7F4EF" }}>
      <Center>
        <div className="pt-16 text-center">
          <div className="mx-auto h-3 w-28 animate-pulse bg-brand-surface border border-brand-line" />
          <div className="mx-auto mt-4 h-10 w-80 max-w-full animate-pulse bg-brand-surface border border-brand-line" />
          <div className="mx-auto mt-4 h-4 w-[32rem] max-w-full animate-pulse bg-brand-surface border border-brand-line" />
        </div>
        <div className="mt-10 pb-16 flex gap-4 overflow-hidden" aria-hidden>
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="h-[360px] w-[320px] shrink-0 animate-pulse rounded-sm bg-brand-surface border-2 border-brand-line" />
          ))}
        </div>
      </Center>
    </section>
  );
}
