// (c) Delta Software 2023, rights reserved.

import { lazy } from "react";
import { IRoute } from "../types";

const Home = lazy(async () => import("../pages/Home"));
const GroupDeliveries = lazy(async () => import("../pages/GroupDeliveries"));
const Components = lazy(async () => import("../components/generics/Examples"));

export const privateRoutes: IRoute[] = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/groupDeliveries",
    component: GroupDeliveries,
  },
  {
    path: "/components",
    component: Components,
  },
];
