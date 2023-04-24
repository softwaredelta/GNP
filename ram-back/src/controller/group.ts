// (c) Delta Software 2023, rights reserved.

import { Router } from "express";
import { authMiddleware } from "./user";
import { createGroup, getUserGroups } from "../app/groups";
import { getDataSource } from "../arch/db-client";
import { GroupEnt } from "../entities/group.entity";

export const groupsRouter = Router();

groupsRouter.get("/my-groups", authMiddleware, async (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: "No user" });
    return;
  }
  const userId = req.user.id;

  const data = await getUserGroups({ userId });

  res.json({ data });
});

groupsRouter.post("/create", authMiddleware, async (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: "No user" });
    return;
  }
  const { name } = req.body;

  const data = await createGroup({ name });

  res.json({ data });
});

groupsRouter.get("/all", async (req, res) => {
  const db = await getDataSource();
  const groups = await db.manager.find(GroupEnt);

  res.json({ groups });
});
