// (c) Delta Software 2023, rights reserved.

import { authMiddleware } from "./user";
import { createGroup, getUserGroups } from "../app/groups";
import { getDataSource } from "../arch/db-client";
import { GroupEnt } from "../entities/group.entity";
import { Router } from "express";
export const groupRouter = Router();

export const groupsRouter = Router();

groupRouter.get("/all", async (req, res) => {
  const ds = await getDataSource();
  const groups = await ds.manager.find(GroupEnt, {
    select: ["id", "name", "imageURL", "groupUsers"],
    relations: ["groupUsers"],
  });

  res.json({ groups });
});

groupsRouter.get("/my-groups", authMiddleware, async (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: "No user" });
    return;
  }
  const userId = req.user.id;

  const data = await getUserGroups({ userId });

  res.json({ data });
});

groupRouter.get("/:id", async (req, res) => {
  const ds = await getDataSource();
  const groups = await ds.manager.findOne(GroupEnt, {
    select: ["id", "name", "groupDeliveries", "groupDeliveries"],
    relations: ["groupDeliveries.userDeliveries"],
    where: {
      id: req.params.id,
    },
  });

  res.json(groups);
});

groupsRouter.post("/create", authMiddleware, async (req, res) => {
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

groupsRouter.get("/all", async (req, res) => {
  const db = await getDataSource();
  const groups = await db.manager.find(GroupEnt);

  res.json({ groups });
});
