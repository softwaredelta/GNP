// (c) Delta Software 2023, rights reserved.

import { lazy } from "react";
import { IRoute } from "../types";

const Home = lazy(async () => import("../pages/Home"));
const Components = lazy(async () => import("../components/generics/Examples"));
const Groups = lazy(async () => import("../pages/Groups"));
const Infra = lazy(async () => import("../pages/InfraTest"));

export const privateRoutes: IRoute[] = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/components",
    component: Components,
  },
  {
    path: "/my-groups",
    component: Groups,
  },
  {
    path: "/infra",
    component: Infra,
  },
  {
    path: "/components",
    component: Components,
  },
];
