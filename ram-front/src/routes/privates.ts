// (c) Delta Software 2023, rights reserved.

import { lazy } from "react";
import { IRoute } from "../types";
import Deliverables from "../pages/Deliverables";

const Home = lazy(async () => import("../pages/Home"));
const InfraTest = lazy(async () => import("../pages/InfraTest"));
const Components = lazy(async () => import("../components/generics/Examples"));
const Groups = lazy(async () => import("../pages/Groups"));

export const privateRoutes: IRoute[] = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/infra-test",
    component: InfraTest,
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
    path: "/my-deliverables",
    component: Deliverables,
  },
];
