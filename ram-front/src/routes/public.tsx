// (c) Delta Software 2023, rights reserved.

import { lazy } from "react";
import { IRoute } from "../types";

const Login = lazy(async () => import("../pages/Login"));

export const PublicRoutes: IRoute[] = [
  {
    path: "/login",
    Component: () => <Login />,
  },
];
