import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";

export default function Home() {
  const nav = useNavigate();
  return (
    <Card>
      <div className="text-lg font-bold">Запис онлайн</div>
      <p className="mt-2 text-sm text-white/70">
        Обери послугу, дату й час. Запис підтверджується одразу — слот блокується автоматично.
      </p>

      <div className="mt-4 space-y-2">
        <Button className="w-full" onClick={() => nav("/services")}>Обрати послугу</Button>
        <Button variant="ghost" className="w-full" onClick={() => nav("/admin")}>Адмін (майстер)</Button>
      </div>

      <div className="mt-4 rounded-xl2 border border-white/10 bg-white/5 p-3 text-xs text-white/70">
        <div className="font-semibold text-white">Colour Bar</div>
        <div>Стрижки • Фарбування • Відновлення</div>
      </div>
    </Card>
  );
}
