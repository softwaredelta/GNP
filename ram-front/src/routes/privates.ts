// (c) Delta Software 2023, rights reserved.

import { lazy } from "react";
import { IRoute } from "../types";

const Home = lazy(async () => import("../pages/Home"));
const GroupDeliveries = lazy(async () => import("../pages/GroupDeliveries"));
const Components = lazy(async () => import("../components/generics/Examples"));
const ManagerCourses = lazy(async () => import("../pages/ManagerCourses"));

export const privateRoutes: IRoute[] = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/managerCourses",
    component: ManagerCourses,
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
