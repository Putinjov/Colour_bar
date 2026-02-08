import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay } from "swiper/modules";

import "swiper/css";

import { getCatalog, type Catalog, type Lang } from "../../../api/catalog.js";
import { useI18n } from "../../../i18n.js";

type Slide = {
  key: string;
  title: string;
  desc: string;
  image: string;
  pill: string;
};

export default function CatalogCategoriesSliderMarquee({
  speed = 7000, // чим більше — тим швидше (бо Swiper speed = тривалість переходу)
}: {
  speed?: number;
}) {
  const nav = useNavigate();
  const { lang } = useI18n();
  const L = (lang === "en" ? "en" : "uk") as Lang;

  const { data, isLoading, error } = useQuery<Catalog>({
    queryKey: ["catalog"],
    queryFn: getCatalog,
  });

  const slides = useMemo<Slide[]>(() => {
  if (!data?.blocks?.length) return [];

  const base = data.blocks.map((b) => ({
    key: b.key,
    title: b.title[L],
    desc: b.description[L],
    image: b.image,
    pill: b.pill[L],
  }));

  // 🔁 якщо категорій мало — дублюємо
  if (base.length < 6) {
    return [...base, ...base, ...base];
  }

  return base;
}, [data, L]);


  if (isLoading) return <div className="text-brand-sub">Loading…</div>;
  if (error) return <div className="text-red-600">{String((error as any)?.message || error)}</div>;
  if (!slides.length) return null;

  return (
    <div className="w-full">
      <Swiper
        modules={[A11y, Autoplay]}
        loop={true}
        // дуже важливо для marquee
        speed={speed}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        allowTouchMove={true}
        grabCursor={true}
        watchSlidesProgress={true}
        spaceBetween={16}
        slidesPerView={1.15}
        centeredSlides={false}
        // щоб “липло” без пауз
        freeMode={true as any}
        breakpoints={{
          480: { slidesPerView: 1.3, spaceBetween: 18 },
          640: { slidesPerView: 2.2, spaceBetween: 20 },
          1024: { slidesPerView: 3.2, spaceBetween: 24 },
          1280: { slidesPerView: 3.6, spaceBetween: 24 },
        }}
        className="marquee-swiper"
      >
        {slides.map((s) => (
          <SwiperSlide key={s.key}>
            <button
              type="button"
              onClick={() => nav(`/services-catalog#${encodeURIComponent(s.key)}`)}
              className="group w-full text-left rounded-[22px] overflow-hidden border border-brand-line bg-white shadow-soft transition hover:shadow-lg"
            >
              <div className="relative h-[320px] sm:h-[360px] overflow-hidden">
                <img
                  src={s.image}
                  alt={s.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.06]"
                />

                {/* “легкий туман” знизу */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />

                {/* hover highlight */}
                <div className="pointer-events-none absolute inset-0 ring-0 ring-brand-yellow/0 group-hover:ring-2 group-hover:ring-brand-yellow/40 transition" />

                {/* pill */}
                <div className="absolute left-4 top-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/85 backdrop-blur border border-white/40 px-3 py-1 text-[11px] font-semibold text-brand-ink">
                    <span className="text-brand-yellow">●</span>
                    {s.pill}
                  </div>
                </div>

                {/* title */}
                <div className="absolute left-5 bottom-4 right-5">
                  <div className="text-white text-xl font-semibold leading-tight drop-shadow">
                    {s.title}
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="text-sm text-brand-sub min-h-[48px] line-clamp-3">
                  {s.desc}
                </div>

                <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-ink">
                  {lang === "en" ? "Explore" : "Детальніше"} <span className="text-lg"></span>
                </div>
              </div>
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* critical: force linear easing (без цього буде “кроками”) */}
      <style>{`
        .marquee-swiper .swiper-wrapper { transition-timing-function: linear !important; }
      `}</style>
    </div>
  );
}
