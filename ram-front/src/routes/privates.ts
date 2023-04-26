// (c) Delta Software 2023, rights reserved.

import { lazy } from "react";
import { IRoute } from "../types";

const Home = lazy(async () => import("../pages/Home"));
const GroupDeliveries = lazy(async () => import("../pages/GroupDeliveries"));
const Components = lazy(async () => import("../components/generics/Examples"));
const ManagerCourses = lazy(async () => import("../pages/ManagerCourses"));
const Groups = lazy(async () => import("../pages/Groups"));
const Group = lazy(async () => import("../pages/Group"));
const Infra = lazy(async () => import("../pages/InfraTest"));

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
    path: "/groupDeliveries/:id",
    component: GroupDeliveries,
  },
  {
    path: "/my-groups",
    component: Groups,
  },
  {
    path: "/group/:id",
    component: Group,
  },
  {
    path: "/infra",
    component: Infra,
  },
  {
    path: "/components",
    component: Components,
  },
  {
    path: "/group/:id",
    component: Group,
  },
];
