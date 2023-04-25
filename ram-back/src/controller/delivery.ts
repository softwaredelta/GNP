// (c) Delta Software 2023, rights reserved.

import { Router } from "express";
import { authMiddleware } from "./user";
import { getDataSource } from "../arch/db-client";
import { DeliveryEnt } from "../entities/delivery.entity";
import { getUserDeliveriesbyGroup } from "../app/deliveries";

export const deliveriesRouter = Router();

deliveriesRouter.get("/my-deliveries/:groupId", authMiddleware, async (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: "No user" });
    return;
  }
  const userId = req.user.id;
  const groupId = req.params.groupId;

  const data = await getUserDeliveriesbyGroup({ userId, groupId });

  res.json({ data });
});

deliveriesRouter.get("/all", async (req, res) => {
  const db = await getDataSource();
  const deliveries = await db.manager.find(DeliveryEnt);

  res.json({ deliveries });
});
