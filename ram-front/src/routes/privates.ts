// (c) Delta Software 2023, rights reserved.

import { lazy } from "react";
import { IRoute } from "../types";

const Home = lazy(async () => import("../pages/Home"));

export const privateRoutes: IRoute[] = [
  {
    path: "/",
    component: Home,
  },
];
