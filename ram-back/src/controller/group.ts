// (c) Delta Software 2023, rights reserved.

import { authMiddleware } from "./user";
import { createGroup, deleteGroup, getUserGroups } from "../app/groups";
import { getDataSource } from "../arch/db-client";
import { GroupEnt } from "../entities/group.entity";
import { Router } from "express";
import { UserRole } from "../entities/user.entity";

export const groupsRouter = Router();

groupsRouter.get(
  "/all",
  authMiddleware({ neededRoles: [UserRole.MANAGER] }),
  async (req, res) => {
    const ds = await getDataSource();
    const groups = await ds.manager.find(GroupEnt, {
      select: ["id", "name", "description", "imageURL", "groupUsers"],
      relations: ["groupUsers"],
    });

    res.json(groups);
  },
);

groupsRouter.get("/my-groups", authMiddleware(), async (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: "No user" });
    return;
  }
  const userId = req.user.id;

  const data = await getUserGroups({ userId });

  res.json({ data });
});

groupsRouter.get("/:id", async (req, res) => {
  const ds = await getDataSource();
  const groups = await ds.manager.findOne(GroupEnt, {
    select: ["id", "name", "deliveries"],
    relations: ["deliveries", "deliveries.userDeliveries"],
    where: {
      id: req.params.id,
    },
  });

  res.json(groups);
});

groupsRouter.delete(
  "/:id",
  authMiddleware({ neededRoles: [UserRole.MANAGER] }),
  async (req, res) => {
    await deleteGroup({
      groupId: req.params.id,
    });

    res.status(200).send();
  },
);

groupsRouter.post("/create", authMiddleware(), async (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: "No user" });
    return;
  }
  const { name } = req.body;

  const data = await createGroup({
    name,
    imageURL: "",
  });

  res.json({ data });
});
