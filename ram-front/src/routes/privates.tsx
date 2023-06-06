// (c) Delta Software 2023, rights reserved.

import { lazy } from "react";
import { IRoute } from "../types";

const Components = lazy(async () => import("../pages/Examples"));
const Infra = lazy(async () => import("../pages/InfraTest"));

const Groups = lazy(async () => import("../pages/Groups"));
const Group = lazy(async () => import("../pages/Group"));
const NewSale = lazy(async () => import("../pages/NewSale"));
const SalesHistory = lazy(async () => import("../pages/SalesHistory"));
const VerifySales = lazy(async () => import("../pages/VerifySales"));
const FunnelProspects = lazy(async () => import("../pages/ProspectsFunnel"));
const ModifySale = lazy(async () => import("../pages/ModifySale"));
const ProspectsHistory = lazy(async () => import("../pages/ProspectsHistory"));

const ManagerGroup = lazy(async () => import("../pages/ManagerGroup"));
const ManagerGroups = lazy(async () => import("../pages/ManagerGroups"));
const ManagerDelivery = lazy(async () => import("../pages/ManagerDelivery"));
const ManageProspects = lazy(async () => import("../pages/ManageProspects"));

const Prospects = lazy(async () => import("../pages/Prospects"));
const Help = lazy(async () => import("../pages/TODO/Help"));
const PlaceholderHome = lazy(async () => import("../pages/PlaceholderHome"));
const EditGroup = lazy(async () => import("../pages/EditGroup"));
const AddUser = lazy(async () => import("../pages/AddUser"));
const Members = lazy(async () => import("../pages/Members"));
const DeliveryGroup = lazy(async () => import("../pages/DeliveryGroup"));
const ManagerDeliveryGroup = lazy(
  async () => import("../pages/ManagerDeliveryGroup"),
);
const Profile = lazy(async () => import("../pages/Profile"));
const MyProfile = lazy(async () => import("../pages/MyProfile"));
const ViewProfile = lazy(async () => import("../pages/ViewProfile"));

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
    path: "/sales-history",
    Component: () => <SalesHistory />,
  },
  {
    path: "/new-sale",
    Component: () => <NewSale />,
  },
  {
    path: "/prospects",
    Component: () => <Prospects />,
  },
  {
    path: "/help",
    Component: () => <Help />,
  },
  {
    path: "/modify-sale/:id",
    Component: () => <ModifySale />,
  },
  {
    path: "/group-delivery/:id",
    Component: () => <DeliveryGroup />,
  },
  {
    path: "/my-profile",
    Component: () => <MyProfile />,
  },
  {
    path: "/prospect-history/:id",
    Component: () => <ProspectsHistory />,
  },
  {
    path: "/profile/:id",
    Component: () => <Profile />,
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
    path: "/add-user",
    Component: () => <AddUser />,
  },
  {
    path: "/members",
    Component: () => <Members />,
  },
  {
    path: "/prospect-history/:id",
    Component: () => <ProspectsHistory />,
  },
  {
    path: "/group-delivery/:id",
    Component: () => <ManagerDeliveryGroup />,
  },
  {
    path: "/profile/:id",
    Component: () => <Profile />,
  },
  {
    path: "/agent-prospects/:id",
    Component: () => <ManageProspects />,
  },
  {
    path: "/my-profile",
    Component: () => <MyProfile />,
  },
  {
    path: "/view-profile/:id",
    Component: () => <ViewProfile />,
  },
];
