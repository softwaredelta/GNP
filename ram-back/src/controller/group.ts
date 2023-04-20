// (c) Delta Software 2023, rights reserved.

import { getDataSource } from "../arch/db-client";
import { GroupEnt } from "../entities/group.entity";
import { Router } from "express";

export const groupRouter = Router();

// FIXME: no auth, endpoint should not be part of API
groupRouter.get("/all", async (req, res) => {
  const ds = await getDataSource();
  const groups = await ds.manager.find(GroupEnt, {
    select: ["id", "name", "groupUsers"],
    relations: ["groupUsers"],
  });

  res.json(groups);
});
