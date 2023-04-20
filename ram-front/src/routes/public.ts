import { lazy } from "react";
import { IRoute } from "../types";

const Login = lazy(async () => await import("../pages/Login"));
const InfraTest = lazy(async () => await import("../pages/InfraTest"));

const Components = lazy(
  async () => await import("../components/generics/Examples"),
);

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
