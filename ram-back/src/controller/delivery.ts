// (c) Delta Software 2023, rights reserved.

import { Router } from "express";
import { authMiddleware } from "./user";
import { getDataSource } from "../arch/db-client";
import { DeliveryEnt } from "../entities/delivery.entity";
import { getUserDeliveriesbyGroup } from "../app/deliveries";
import { UserRole } from "../entities/user.entity";

export const deliveriesRouter = Router();

deliveriesRouter.get(
  "/my-deliveries/:groupId",
  authMiddleware(),
  async (req, res) => {
    if (!req.user) {
      res.status(401).json({ message: "No user" });
      return;
    }
    const userId = req.user.id;
    const groupId = req.params.groupId;

    const { userDeliveries, error } = await getUserDeliveriesbyGroup({
      userId,
      groupId,
    });

    if (error) {
      throw new Error(error);
    }

    res.json(userDeliveries);
  },
);

deliveriesRouter.get("/all", async (req, res) => {
  const db = await getDataSource();
  const deliveries = await db.manager.find(DeliveryEnt);

  res.json({ deliveries });
});

deliveriesRouter.get(
  "/:id",
  authMiddleware({ neededRoles: [UserRole.MANAGER] }),
  async (req, res) => {
    const ds = await getDataSource();
    const id = req.params.id;

    const delivery = await ds.manager.findOneOrFail(DeliveryEnt, {
      where: {
        id,
      },
      relations: ["userDeliveries", "userDeliveries.user"],
    });

    res.json(delivery);
  },
);
