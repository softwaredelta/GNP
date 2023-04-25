// (c) Delta Software 2023, rights reserved.

import { getDataSource } from "../arch/db-client";
import { DeliveryEnt } from "../entities/delivery.entity";
import { GroupEnt } from "../entities/group.entity";
import { Router } from "express";
// import {getDeliveryGroups, getUserGroups} from "../app/groups";

export const groupRouter = Router();

// FIXME: no auth, endpoint should not be part of API
groupRouter.get("/all", async (req, res) => {
  const ds = await getDataSource();
  const groups = await ds.manager.find(GroupEnt, {
    select: ["id", "name", "imageURL", "groupUsers"],
    relations: ["groupUsers"],
  });

  res.json(groups);
});

groupRouter.get("/:id", async (req, res) => {
  const ds = await getDataSource();
  const groups = await ds.manager.findOne(GroupEnt, {
    select: ["id", "groupDeliveries", "groupDeliveries"],
    relations: ["groupDeliveries.userDeliveries"],
    where: {
      id: req.params.id,
    },
  });

  res.json(groups);
});
