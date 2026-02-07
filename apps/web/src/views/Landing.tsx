import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";

export default function Landing() {
  const nav = useNavigate();

  return (
    <div className="space-y-3">
      {/* HERO */}
      <div
        className="rounded-xl2 border border-white/10 bg-brand-paper/70 shadow-soft overflow-hidden"
        style={{
          background:
            "radial-gradient(600px 260px at 20% 0%, rgba(246,196,69,0.25), transparent 60%)," +
            "radial-gradient(600px 260px at 80% 0%, rgba(109,40,217,0.25), transparent 60%)," +
            "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
        }}
      >
        <div className="p-5">
          <div className="inline-flex items-center gap-2 rounded-xl2 bg-white/5 border border-white/10 px-3 py-2 text-xs text-white/80">
            💛💜 Colour Bar • Tullamore / Ireland
          </div>

          <h1 className="mt-4 text-2xl font-extrabold leading-tight">
            Салон краси <span className="text-brand-yellow">Colour Bar</span>
          </h1>

          <p className="mt-2 text-sm text-white/70">
            Стрижки • Фарбування (AirTouch / Balayage / Ombre) • Відновлення волосся.
            Онлайн-запис за 30 секунд.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-2">
            <Button className="w-full" onClick={() => nav("/services")}>
              Записатися онлайн
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => nav("/services")}>
              Переглянути послуги
            </Button>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-white/60">
            <span>🕒 Вт–Сб 10:00–18:00</span>
            <span>⏱️ Слоти по 15 хв</span>
          </div>
        </div>
      </div>

      {/* QUICK BOOK (mini CTA card) */}
      <Card>
        <div className="text-sm font-semibold">Швидкий запис</div>
        <p className="mt-1 text-sm text-white/70">
          Натисни “Записатися” → обери послугу → дату → час → введи імʼя та телефон.
        </p>
        <div className="mt-3">
          <Button className="w-full" onClick={() => nav("/services")}>
            Записатися
          </Button>
        </div>
      </Card>

      {/* SERVICES PREVIEW */}
      <Card>
        <div className="text-sm font-semibold">Послуги</div>

        <div className="mt-3 space-y-2">
          <Feature title="Стрижки" text="Чоловічі, жіночі та дитячі." />
          <Feature title="Фарбування" text="Однотон, AirTouch, Balayage, Ombre/Sombre, Highlight/Melting." />
          <Feature title="Відновлення" text="Botox/Keratin, Olaplex/Bonding, глибоке відновлення." />
        </div>

        <div className="mt-4">
          <Button variant="ghost" className="w-full" onClick={() => nav("/services")}>
            Обрати послугу і записатися
          </Button>
        </div>
      </Card>

      {/* WHY US */}
      <Card>
        <div className="text-sm font-semibold">Чому Colour Bar</div>
        <div className="mt-3 grid grid-cols-1 gap-2">
          <Bullet>Акуратна робота з кольором і здоров’ям волосся</Bullet>
          <Bullet>Зручний онлайн-запис без дзвінків</Bullet>
          <Bullet>Прозора тривалість процедур та таймінг</Bullet>
        </div>
      </Card>

      {/* CONTACT / CTA */}
      <Card>
        <div className="text-sm font-semibold">Контакти</div>
        <div className="mt-2 text-sm text-white/70">
          <div>📍 Tullamore, Ireland</div>
          <div className="mt-1">📞 Телефон: <span className="text-white">додай у коді</span></div>
          <div className="mt-1">📷 Instagram: <span className="text-white">додай у коді</span></div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2">
          <Button className="w-full" onClick={() => nav("/services")}>
            Записатися онлайн
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => alert("Додай свій номер/Instagram у Landing.tsx і зробимо клікабельні лінки")}
          >
            Зробити “Подзвонити / Instagram”
          </Button>
        </div>
      </Card>
    </div>
  );
}

function Feature({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl2 border border-white/10 bg-white/5 p-3">
      <div className="text-sm font-semibold">{title}</div>
      <div className="text-xs text-white/70 mt-1">{text}</div>
    </div>
  );
}

function Bullet({ children }: React.PropsWithChildren) {
  return (
    <div className="rounded-xl2 border border-white/10 bg-white/5 p-3 text-sm">
      <span className="text-brand-yellow font-bold">•</span> <span className="text-white/80">{children}</span>
    </div>
  );
}
