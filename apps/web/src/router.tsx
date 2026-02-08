import React from "react";
import { createBrowserRouter } from "react-router-dom";
import AppShell from "./ui/AppShell.js";
import Landing from "./views/Landing/index.js";
import Services from "./views/Services.js";
import DateTime from "./views/DateTime.js";
import Details from "./views/Details.js";
import Success from "./views/Success.js";
import Admin from "./views/Admin.js";
import ServicesCatalog from "./views/ServicesCatalog.js";
import AdminCatalog from "./views/admin/AdminCatalog.js";


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
