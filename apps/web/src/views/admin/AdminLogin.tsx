import React, { useState } from "react";
import { useI18n } from "../../i18n.js";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../api/admin";
import { setAdminToken } from "../../lib/adminAuth";

export default function AdminLogin() {
  const nav = useNavigate();
  const {lang,setLang}=useI18n();
  const l=(uk:string,en:string)=>lang==="uk"?uk:en;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const { token } = await adminLogin(email, password);
      setAdminToken(token);
      nav("/admin",{replace:true});
    } catch (e: any) {
      setErr(e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-5 pb-12 pt-[max(3rem,env(safe-area-inset-top))]">
      <div className="flex items-center justify-between"><img src="/branding/manager-192.png" alt="Colour Lab" className="h-16 w-16 rounded-2xl"/><button onClick={()=>setLang(lang==="uk"?"en":"uk")} className="rounded-full border border-brand-line px-3 py-2 text-sm">{lang==="uk"?"EN":"UA"}</button></div><h1 className="mt-5 font-serif text-3xl text-brand-ink">Colour Lab Manager</h1><p className="mt-2 text-sm text-brand-sub">{l("Увійдіть до кабінету майстра","Sign in to your studio calendar")}</p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <input
          className="w-full rounded-xl border border-brand-line bg-white px-4 py-3"
          placeholder="Email" aria-label="Email" type="email" autoComplete="username" required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full rounded-xl border border-brand-line bg-white px-4 py-3"
          placeholder={l("Пароль","Password")} aria-label={l("Пароль","Password")} autoComplete="current-password" required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {err && <div className="text-sm text-red-600">{err}</div>}

        <button
          disabled={loading}
          className="w-full rounded-full bg-brand-ink text-white px-6 py-3 text-sm font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "…" : l("Увійти","Sign in")}
        </button>
      </form>
    </div>
  );
}
