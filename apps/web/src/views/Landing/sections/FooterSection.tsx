import React from "react";
import { useI18n } from "../../../i18n.js";
import Center from "../components/Center.js";
import SocialIcon from "../components/SocialIcon.js";
import { FaInstagram, FaTiktok, FaFacebookF } from "react-icons/fa";


export default function FooterSection() {
  const { lang } = useI18n();

  return (
    <section
      className="w-screen "
      style={{ background: "#F3EEE6" }}
    >
      <Center>
        <div className="py-12">
          <div className="grid gap-10 md:grid-cols-4">
            {/* Brand */}
            <div>
              <div className="text-lg font-medium tracking-tight">
                <span className="text-brand-ink">Colour </span>
                <span className="text-brand-yellow">Lab</span>
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
                  <span>+353857842329</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>✉️</span>
                  <span>motarivna@icloud.com</span>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <SocialIcon
                  href="https://instagram.com/hair_by_marina_ie"
                  label="Instagram">
                    <FaInstagram size={18} />
                </SocialIcon>

                <SocialIcon
                  href="https://www.tiktok.com/@hair_by_marina"
                  label="TikTok">
                    <FaTiktok size={18} />
                </SocialIcon>

                <SocialIcon
                  href="https://facebook.com/"
                  label="Facebook">
                    <FaFacebookF size={18} />
                  </SocialIcon>
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
  function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}
    function TikTokIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 4V16C9 19.866 12.134 23 16 23C19.866 23 23 19.866 23 16C23 12.134 19.866 9 16 9H14V4H9Z" />
    </svg>
  );  
}
    function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M18 2H15C12.243 2 10 4.243 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.448 14.448 6 15 6H18V2Z" />
    </svg>
  );
    }
  }
