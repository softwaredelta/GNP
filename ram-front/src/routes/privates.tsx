// (c) Delta Software 2023, rights reserved.

import { lazy } from "react";
import { IRoute } from "../types";
const ManagerModifyGroup = lazy(
  async () => import("../pages/ManagerModifyGroup"),
);

const Components = lazy(async () => import("../pages/Examples"));
const Infra = lazy(async () => import("../pages/InfraTest"));

const Groups = lazy(async () => import("../pages/Groups"));
const Group = lazy(async () => import("../pages/Group"));
const NewSale = lazy(async () => import("../pages/NewSale"));
const SalesHistory = lazy(async () => import("../pages/SalesHistory"));
const VerifySales = lazy(async () => import("../pages/VerifySales"));
const FunnelProspects = lazy(async () => import("../pages/ProspectsFunnel"));

const ManagerGroup = lazy(async () => import("../pages/ManagerGroup"));
const ManagerGroups = lazy(async () => import("../pages/ManagerGroups"));
const ManagerDelivery = lazy(async () => import("../pages/ManagerDelivery"));

const MySalesMetrics = lazy(async () => import("../pages/TODO/MySalesMetrics"));
const GoalsHistory = lazy(async () => import("../pages/TODO/GoalsHistory"));
const NewGoal = lazy(async () => import("../pages/TODO/NewGoal"));
const Prospects = lazy(async () => import("../pages/Prospects"));
const Help = lazy(async () => import("../pages/TODO/Help"));
const PlaceholderHome = lazy(
  async () => import("../pages/TODO/PlaceholderHome"),
);
const EditGroup = lazy(async () => import("../pages/EditGroup"));

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
    Component: () => <PlaceholderHome />,
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
    path: "/modigy-group/:id",
    Component: () => <ManagerModifyGroup />,
  },
  {
    path: "/sales-history",
    Component: () => <SalesHistory />,
  },
  {
    path: "/new-sale",
    Component: () => <NewSale />,
  },
  {
    path: "/my-sales-metrics",
    Component: () => <MySalesMetrics />,
  },
  {
    path: "/goals-history",
    Component: () => <GoalsHistory />,
  },
  {
    path: "/new-goal",
    Component: () => <NewGoal />,
  },
  {
    path: "/prospects",
    Component: () => <Prospects />,
  },
  {
    path: "/help",
    Component: () => <Help />,
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
    path: "/group/edit/:id",
    Component: () => <EditGroup />,
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
    path: "/prospects",
    Component: () => <FunnelProspects />,
  },
  {
    path: "/help",
    Component: () => <Help />,
  },
  {
    path: "/help",
    Component: () => <Help />,
  },
  {
    path: "/goals",
    Component: () => <GoalsHistory />,
  },
];
