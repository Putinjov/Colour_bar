import React from "react";
import { I18nProvider } from "./i18n.js";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { router } from "./router.js";
import { queryClient } from "./query.js";
import "./index.css";

const HERO_IMAGE_URL =
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1600&q=80";

function preloadHeroImage() {
  const existing = document.querySelector(`link[rel=\"preload\"][href=\"${HERO_IMAGE_URL}\"]`);
  if (existing) return;

  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = HERO_IMAGE_URL;
  document.head.appendChild(link);
}

preloadHeroImage();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <I18nProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </I18nProvider>
  </React.StrictMode>
);
