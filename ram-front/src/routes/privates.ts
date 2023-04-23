// (c) Delta Software 2023, rights reserved.

import { lazy } from "react";
import { IRoute } from "../types";

const Home = lazy(async () => import("../pages/Home"));
const NewSale = lazy(async () => import("../pages/NewSale"));
const Components = lazy(async () => import("../components/generics/Examples"));

export const privateRoutes: IRoute[] = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/new-sale",
    component: NewSale,
  },
  {
    path: "/componentsPage",
    component: Components,
  },
];
