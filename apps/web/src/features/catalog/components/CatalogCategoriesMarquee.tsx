import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCatalog, type Catalog, type Lang } from "../../../api/catalog.js";
import { useI18n } from "../../../i18n.js";

type Slide = {
  key: string;
  title: string;
  desc: string;
  image: string;
  pill: string;
};

const MAX_SLIDES = 6;

function createSlides(data: Catalog | undefined, L: Lang): Slide[] {
  if (!data?.blocks?.length) return [];

  return data.blocks.slice(0, MAX_SLIDES).map((block) => ({
    key: block.key,
    title: block.title[L],
    desc: block.description[L],
    image: block.image,
    pill: block.pill[L],
  }));
}

function SlideCard({ slide }: { slide: Slide }) {
  const nav = useNavigate();
  const { lang } = useI18n();

  return (
    <li className="w-[280px] sm:w-[320px] lg:w-[360px] shrink-0 snap-start">
      <button
        type="button"
        onClick={() => nav(`/services-catalog#${encodeURIComponent(slide.key)}`)}
        className="group w-full text-left rounded-sm overflow-hidden border-2 border-brand-line bg-brand-surface shadow-soft transition hover:brightness-110"
      >
        <div className="relative h-[320px] sm:h-[360px] overflow-hidden">
          <img
            src={slide.image}
            alt={slide.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.06]"
          />

          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
          <div className="pointer-events-none absolute inset-0 ring-0 ring-brand-yellow/0 group-hover:ring-2 group-hover:ring-brand-yellow/40 transition" />

          <div className="absolute left-4 top-4">
            <div className="inline-flex items-center gap-2 rounded-sm bg-brand-yellow border-2 border-brand-yellow px-3 py-1 text-[11px] font-semibold text-brand-ink">
              <span className="text-brand-yellow">●</span>
              {slide.pill}
            </div>
          </div>

          <div className="absolute left-5 bottom-4 right-5">
            <div className="text-white text-xl font-semibold leading-tight drop-shadow">{slide.title}</div>
          </div>
        </div>

        <div className="p-5">
          <div className="text-sm text-brand-sub min-h-[48px] line-clamp-3">{slide.desc}</div>

          <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-ink">
            {lang === "en" ? "Explore" : "Детальніше"}
          </div>
        </div>
      </button>
    </li>
  );
}

export default function CatalogCategoriesMarquee() {
  const { lang } = useI18n();
  const L = (lang === "en" ? "en" : "uk") as Lang;

  const { data, isLoading, error } = useQuery<Catalog>({
    queryKey: ["catalog", L],
    queryFn: getCatalog,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const slides = useMemo(() => createSlides(data, L), [data, L]);

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-hidden" aria-hidden>
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="h-[360px] w-[320px] shrink-0 animate-pulse rounded-sm bg-brand-surface border-2 border-brand-line" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600">{String((error as Error)?.message || error)}</div>;
  }

  if (!slides.length) return null;

  return (
    <div className="w-full overflow-hidden" aria-label="Services categories carousel">
      <div className="catalog-marquee group relative">
        <ul className="catalog-marquee-track flex gap-4 sm:gap-5 lg:gap-6 w-max py-2">
          {slides.map((slide) => (
            <SlideCard key={slide.key} slide={slide} />
          ))}
          {slides.map((slide) => (
            <SlideCard key={`${slide.key}-duplicate`} slide={slide} />
          ))}
        </ul>
      </div>
    </div>
  );
}
