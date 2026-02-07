import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function AppShell() {
  const loc = useLocation();
  const nav = useNavigate();
  const canBack = loc.pathname !== "/";

  return (
    <div className="min-h-dvh bg-brand-ink text-white">
      <div className="mx-auto max-w-md px-4 pb-10">
        <header className="pt-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl2 bg-brand-yellow text-brand-ink grid place-items-center font-black">CB</div>
              <div>
                <div className="text-xl font-extrabold leading-tight">ColourLab</div>
                <div className="text-xs text-white/70">Онлайн запис</div>
              </div>
            </div>
            {canBack && (
              <button
                onClick={() => nav(-1)}
                className="text-xs font-semibold px-3 py-2 rounded-xl2 bg-white/5 border border-white/10 hover:bg-white/10"
              >
                Назад
              </button>
            )}
          </div>
        </header>

        <Outlet />

        <footer className="mt-6 text-center text-[11px] text-white/50">
          💛💜 ColourLab • Dublin time • 1 майстер
        </footer>
      </div>
    </div>
  );
}
