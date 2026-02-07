import React, { createContext, useContext, useMemo, useState } from "react";

export type Lang = "uk" | "en";

type Dict = Record<string, { uk: string; en: string }>;

const dict: Dict = {
  "brand.tagline": { uk: "Онлайн запис", en: "Online booking" },
  "nav.back": { uk: "Назад", en: "Back" },

  "landing.badge": { uk: "Colour Bar • Tullamore / Ireland", en: "Colour Bar • Tullamore / Ireland" },
  "landing.title": { uk: "Салон краси", en: "Beauty salon" },
  "landing.subtitle": {
    uk: "Стрижки • Фарбування (AirTouch / Balayage / Ombre) • Відновлення волосся. Онлайн-запис за 30 секунд.",
    en: "Haircuts • Colouring (AirTouch / Balayage / Ombre) • Hair repair. Book online in 30 seconds.",
  },
  "landing.cta.book": { uk: "Записатися онлайн", en: "Book online" },
  "landing.cta.services": { uk: "Переглянути послуги", en: "View services" },
  "landing.hours": { uk: "Вт–Сб 10:00–18:00", en: "Tue–Sat 10:00–18:00" },
  "landing.step": { uk: "Слоти по 15 хв", en: "15-min slots" },

  "section.quick.title": { uk: "Швидкий запис", en: "Quick booking" },
  "section.quick.text": {
    uk: "Натисни “Записатися” → обери послугу → дату → час → введи імʼя та телефон.",
    en: "Tap “Book” → choose service → date → time → enter name & phone.",
  },
  "section.services.title": { uk: "Послуги", en: "Services" },
  "service.haircuts": { uk: "Стрижки", en: "Haircuts" },
  "service.haircuts.text": { uk: "Чоловічі, жіночі та дитячі.", en: "Men, women & kids." },
  "service.colour": { uk: "Фарбування", en: "Colouring" },
  "service.colour.text": {
    uk: "Однотон, AirTouch, Balayage, Ombre/Sombre, Highlight/Melting.",
    en: "Single tone, AirTouch, Balayage, Ombre/Sombre, Highlights/Melting.",
  },
  "service.repair": { uk: "Відновлення", en: "Repair" },
  "service.repair.text": { uk: "Botox/Keratin, Olaplex/Bonding, глибоке відновлення.", en: "Botox/Keratin, Olaplex/Bonding, deep repair." },

  "section.why.title": { uk: "Чому Colour Bar", en: "Why Colour Bar" },
  "why.1": { uk: "Акуратна робота з кольором і здоров’ям волосся", en: "Careful work with colour & hair health" },
  "why.2": { uk: "Зручний онлайн-запис без дзвінків", en: "Easy online booking — no calls needed" },
  "why.3": { uk: "Прозора тривалість процедур та таймінг", en: "Clear timing & duration" },

  "section.contact.title": { uk: "Контакти", en: "Contacts" },
  "contact.location": { uk: "Tullamore, Ireland", en: "Tullamore, Ireland" },
  "contact.phone": { uk: "Телефон", en: "Phone" },
  "contact.instagram": { uk: "Instagram", en: "Instagram" },

  "services.title": { uk: "Послуги", en: "Services" },
};

function getStoredLang(): Lang {
  const raw = localStorage.getItem("colourbar.lang");
  return raw === "en" ? "en" : "uk";
}

const I18nCtx = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof dict) => string;
} | null>(null);

export function I18nProvider({ children }: React.PropsWithChildren) {
  const [lang, setLangState] = useState<Lang>(getStoredLang());

  const setLang = (l: Lang) => {
    localStorage.setItem("colourbar.lang", l);
    setLangState(l);
  };

  const t = useMemo(() => {
    return (key: keyof typeof dict) => dict[key]?.[lang] ?? String(key);
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);
  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
