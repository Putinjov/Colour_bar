import React from "react";
import { useI18n } from "../../../i18n";
import Center from "../components/Center";

export default function FooterSection() {
  const { lang } = useI18n();

  return (
    <section
      className="w-screen snap-start"
      style={{ background: "#F3EEE6" }}
    >
      <Center>
        <div className="py-12">
          <div className="grid gap-10 md:grid-cols-4">
            {/* Brand */}
            <div>
              <div className="text-lg font-medium tracking-tight">
                <span className="text-brand-ink">Colour</span>
                <span className="text-brand-yellow">Bar</span>
              </div>
              <p className="mt-4 text-sm text-brand-sub max-w-sm">
                {lang === "en"
                  ? "Premium hair care and styling services with a personalised approach."
                  : "Преміальні послуги для волосся з персональним підходом."}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <div className="text-sm font-semibold text-brand-ink">
                {lang === "en" ? "Quick Links" : "Швидкі посилання"}
              </div>
              <div className="mt-4 space-y-2 text-sm text-brand-sub">
                <button
                  className="hover:text-brand-ink"
                  onClick={() => document.getElementById("home")?.scrollIntoView({ behavior: "smooth" })}
                >
                  {lang === "en" ? "Home" : "Головна"}
                </button>
                <button
                  className="block hover:text-brand-ink"
                  onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
                >
                  {lang === "en" ? "Services" : "Послуги"}
                </button>
                <button
                  className="block hover:text-brand-ink"
                  onClick={() => document.getElementById("schedule")?.scrollIntoView({ behavior: "smooth" })}
                >
                  {lang === "en" ? "Schedule" : "Графік"}
                </button>
              </div>
            </div>

            {/* Services */}
            <div>
              <div className="text-sm font-semibold text-brand-ink">
                {lang === "en" ? "Services" : "Послуги"}
              </div>
              <div className="mt-4 space-y-2 text-sm text-brand-sub">
                <div>{lang === "en" ? "Hair Colouring" : "Фарбування"}</div>
                <div>{lang === "en" ? "Haircuts" : "Стрижки"}</div>
                <div>{lang === "en" ? "Hair Repair" : "Відновлення"}</div>
              </div>
            </div>

            {/* Contact */}
            <div>
              <div className="text-sm font-semibold text-brand-ink">
                {lang === "en" ? "Contact" : "Контакти"}
              </div>

              <div className="mt-4 space-y-3 text-sm text-brand-sub">
                <div className="flex items-center gap-3">
                  <span>📞</span>
                  <span>+353 …</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>✉️</span>
                  <span>hello@colourbar.ie</span>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <button className="h-10 w-10 rounded-full bg-brand-surface border border-brand-line hover:bg-brand-muted transition">
                  ⓘ
                </button>
                <button className="h-10 w-10 rounded-full bg-brand-surface border border-brand-line hover:bg-brand-muted transition">
                  ◎
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-brand-line pt-6 text-center text-xs text-brand-sub">
            © {new Date().getFullYear()} Colour Bar. {lang === "en" ? "All rights reserved." : "Всі права захищено."}
          </div>
        </div>
      </Center>
    </section>
  );
}
