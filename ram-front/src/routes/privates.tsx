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
const NewSale = lazy(async () => import("../pages/NewSale"));
const SalesHistory = lazy(async () => import("../pages/SalesHistory"));
const VerifySales = lazy(async () => import("../pages/VerifySales"));

export const CommonUserRoutes: IRoute[] = [
  {
    path: "/infra",
    Component: () => <Infra />,
  },
  {
    path: "/components",
    Component: () => <Components />,
  },
  {
    path: "/",
    Component: () => <Home />,
  },
];

export const RegularUserRoutes: IRoute[] = [
  {
    path: "/my-groups",
    Component: () => <Groups />,
  },
  {
    path: "/group/:id",
    Component: () => <Group />,
  },
  {
    path: "/sales-history",
    Component: () => <SalesHistory />,
  },
  {
    path: "/new-sale",
    Component: () => <NewSale />,
  },
];

export const ManagerUserRoutes: IRoute[] = [
  {
    path: "/managerCourses",
    Component: () => <ManagerCourses />,
  },
  {
    path: "/groupDeliveries/:id",
    Component: () => <GroupDeliveries />,
  },
  {
    path: "/verify-sales",
    Component: () => <VerifySales />,
  },
];
