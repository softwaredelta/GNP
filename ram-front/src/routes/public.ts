// (c) Delta Software 2023, rights reserved.

import { lazy } from "react";
import { IRoute } from "../types";

const Login = lazy(async () => import("../pages/Login"));
const InfraTest = lazy(async () => import("../pages/InfraTest"));
const Components = lazy(async () => import("../components/generics/Examples"));

export const publicRoutes: IRoute[] = [
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/infra-test",
    component: InfraTest,
  },
  {
    path: "/components",
    component: Components,
  },
];
