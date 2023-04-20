// (c) Delta Software 2023, rights reserved.
import { Router } from "express";
import { getDataSource } from "../arch/db-client";
import { GroupEnt } from "../entities/group.entity";

export const groupRouter = Router();

groupRouter.get("/all", async (req, res) => {
  const ds = await getDataSource();
  const groups = await ds.manager.find(GroupEnt, {
    select: ["id", "name"],
  });

  res.json(groups);
});

groupRouter.get("/:id", async (req, res) => {
  const ds = await getDataSource();
  const group = await ds.manager.findOne(GroupEnt, {
    where: {
      id: req.params.id,
    },
    select: ["name"],
  });

  res.json(group);
});

