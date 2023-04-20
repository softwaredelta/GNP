import { lazy } from "react";
import { IRoute } from "../types";

const Home = lazy(async () => await import("../pages/Home"));

export const privateRoutes: IRoute[] = [
  {
    path: "/",
    component: Home,
  },
];
