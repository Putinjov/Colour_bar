import React, { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import AppShell from "./ui/AppShell.js";
import Landing from "./views/Landing/index.js";
import Services from "./views/Services.js";

const DateTime = lazy(() => import("./features/booking/pages/DateTimePage.js"));
const Details = lazy(() => import("./features/booking/pages/DetailsPage.js"));
const Success = lazy(() => import("./features/booking/pages/SuccessPage.js"));
const Admin = lazy(() => import("./features/admin/pages/AdminPage.js"));
const ServicesCatalog = lazy(() => import("./features/catalog/pages/ServicesCatalogPage.js"));
const AdminCatalog = lazy(() => import("./features/admin/pages/AdminCatalogPage.js"));
const AdminLogin = lazy(() => import("./features/admin/pages/AdminLoginPage.js"));

function RouteFallback() {
  return <div className="py-8 text-sm text-brand-sub">Loading…</div>;
}

function lazyRoute(element: React.ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <Landing /> },
      { path: "services", element: <Services /> },
      { path: "/services-catalog", element: lazyRoute(<ServicesCatalog />) },
      { path: "datetime", element: lazyRoute(<DateTime />) },
      { path: "details", element: lazyRoute(<Details />) },
      { path: "success", element: lazyRoute(<Success />) },
    ],
  },
  { path: "/admin", element: lazyRoute(<Admin />) },
  { path: "/admin-catalog", element: lazyRoute(<AdminCatalog />) },
  { path: "/admin/login", element: lazyRoute(<AdminLogin />) },
]);
