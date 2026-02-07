import React from "react";
import { useNavigate } from "react-router-dom";

type Reveal = "" | "fade-left" | "fade-right" | "zoom";

export default function ServiceCard({
  title,
  description,
  image,
  target,
  icon,
  delay = 0,
  reveal = "",
}: {
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  target: "colouring" | "haircuts" | "repair";
  delay?: number;
  reveal?: Reveal;
}) {
  const nav = useNavigate();

  return (
    <button
      onClick={() => nav("/services-catalog", { state: { target } })}
      data-reveal={reveal || undefined}
      data-delay={delay}
      className={[
        "group w-full text-left",
        // однакова висота картки: робимо всю кнопку flex-col
        "flex flex-col",
      ].join(" ")}
    >
      {/* IMAGE CARD (fixed height) */}
      <div
        className={[
          "relative rounded-[22px] overflow-hidden border bg-brand-surface shadow-soft",
          "border-brand-line transition",
          // hover: підсвітка бордера
          "group-hover:border-brand-purple/60",
        ].join(" ")}
      >
        <div className="relative">
          {/* image (hover zoom) */}
          <img
            src={image}
            alt={title}
            className={[
              "h-[240px] md:h-[300px] w-full object-cover",
              "transition-transform duration-500 ease-out",
              "group-hover:scale-[1.05]",
            ].join(" ")}
          />

          {/* dark bottom gradient for title readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

          {/* “light fog” bottom haze like sample */}
          <div
            className="absolute left-0 right-0 bottom-0 h-28"
            style={{
              background:
                "linear-gradient(to top, rgba(255,255,255,0.22), rgba(255,255,255,0.10), transparent)",
              filter: "blur(0.2px)",
            }}
          />
        </div>

        {/* Title */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="text-xl font-semibold text-white">{title}</div>
        </div>

        {/* Icon top-right (gold) */}
        <div className="absolute top-4 right-4">
          <div
            className={[
              "h-11 w-11 rounded-full grid place-items-center shadow-soft",
              "bg-brand-yellow/90 text-brand-ink border border-white/30",
              "transition-transform duration-300",
              "group-hover:scale-[1.03]",
            ].join(" ")}
          >
            {icon}
          </div>
        </div>
      </div>

      {/* DESCRIPTION (same height across cards) */}
      <div
        className={[
          "mt-4 text-sm text-brand-sub leading-relaxed",
          // щоб висота була однакова — фіксуємо мін-висоту (3 рядки)
          "min-h-[64px]",
        ].join(" ")}
      >
        {description}
      </div>
    </button>
  );
}
