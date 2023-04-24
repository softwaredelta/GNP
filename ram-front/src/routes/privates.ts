// (c) Delta Software 2023, rights reserved.

import { lazy } from "react";
import { IRoute } from "../types";

const Home = lazy(async () => import("../pages/Home"));
const SalesHistory = lazy(async () => import("../pages/SalesHistory"));
const NewSale = lazy(async () => import("../pages/NewSale"));

export const privateRoutes: IRoute[] = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/sales-history",
    component: SalesHistory,
  },
  {
    path: "/new-sale",
    component: NewSale,
  },
];
