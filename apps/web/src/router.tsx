import React from "react";
import { createBrowserRouter } from "react-router-dom";
import AppShell from "./ui/AppShell";
import Landing from "./views/Landing/index";
import Services from "./views/Services";
import DateTime from "./views/DateTime";
import Details from "./views/Details";
import Success from "./views/Success";
import Admin from "./views/Admin";
import ServicesCatalog from "./views/ServicesCatalog";
import AdminCatalog from "./views/admin/AdminCatalog";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <Landing /> },
      { path: "services", element: <Services /> },
      { path: "datetime", element: <DateTime /> },
      { path: "details", element: <Details /> },
      { path: "success", element: <Success /> },
      { path: "admin", element: <Admin /> },
      { path: "/services-catalog", element: <ServicesCatalog /> },
      { path: "/admin-catalog", element: <AdminCatalog /> }

    ],
  },
]);
