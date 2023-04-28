// (c) Delta Software 2023, rights reserved.

import { lazy } from "react";
import { IRoute } from "../types";

const Home = lazy(async () => import("../pages/Home"));
const Components = lazy(async () => import("../components/generics/Examples"));
const Infra = lazy(async () => import("../pages/InfraTest"));

const Groups = lazy(async () => import("../pages/Groups"));
const Group = lazy(async () => import("../pages/Group"));
const NewSale = lazy(async () => import("../pages/NewSale"));
const SalesHistory = lazy(async () => import("../pages/SalesHistory"));
const VerifySales = lazy(async () => import("../pages/VerifySales"));

const ManagerGroup = lazy(async () => import("../pages/ManagerGroup"));
const ManagerGroups = lazy(async () => import("../pages/ManagerGroups"));
const ManagerDelivery = lazy(async () => import("../pages/ManagerDelivery"));

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
    path: "/groups",
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
    path: "/groups",
    Component: () => <ManagerGroups />,
  },
  {
    path: "/group/:id",
    Component: () => <ManagerGroup />,
  },
  {
    path: "/delivery/:id",
    Component: () => <ManagerDelivery />,
  },
  {
    path: "/verify-sales",
    Component: () => <VerifySales />,
  },
  {
    path: "/verify-sales",
    Component: () => <VerifySales />,
  },
];
