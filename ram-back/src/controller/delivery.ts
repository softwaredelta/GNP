// (c) Delta Software 2023, rights reserved.

import { Router } from "express";
import { authMiddleware } from "./user";
import { getDataSource } from "../arch/db-client";
import { DeliveryEnt} from "../entities/delivery.entity";
import {
  getUserDeliveriesbyGroup,
  updateDeliveryStatus,
} from "../app/deliveries";
import { UserRole } from "../entities/user.entity";
import { UserDeliveryEnt, StatusUserDelivery } from "../entities/user-delivery.entity";
import * as j from "joi";
import { RequestHandler } from "express";

export const deliveriesRouter = Router();

const updateParameters = j.object({
  userId: j.string().required(),
  statusChange: j.boolean().required(),
});

const updateParametersMiddleware: RequestHandler = (req, res, next) => {
  const { error } = updateParameters.validate(req.body);
  if (error) {
    res.status(400).json({ message: "BAD_DATA", reason: error });
    return;
  }
  next();
};

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

deliveriesRouter.get("/all-user", async (req, res) => {
  const db = await getDataSource();
  const deliveries = await db.manager.find(UserDeliveryEnt);

  res.json({ deliveries });
});

deliveriesRouter.get(
  "/:id",
  authMiddleware({ neededRoles: [UserRole.MANAGER] }),
  async (req, res) => {
    const ds = await getDataSource();
    const id = req.params.id;

    const delivery = await ds.manager.findOne(DeliveryEnt, {
      where: {
        id,
      },
      relations: ["userDeliveries", "userDeliveries.user"],
    });

    if (!delivery) {
      res.status(404).json({ message: "Delivery not found" });
      return;
    }

    res.json(delivery);
  },
);

deliveriesRouter.get(
  "/pending/:id",
  authMiddleware({ neededRoles: [UserRole.MANAGER] }),
  async (req, res) => {
    const ds = await getDataSource();
    const id = req.params.id;

    const delivery = await ds.manager.findOne(DeliveryEnt, {
      relations: ["userDeliveries", "userDeliveries.user"],
      where: {
        id,
        userDeliveries: {
          status: StatusUserDelivery.withoutSending,
        }
      },
    });

    if (!delivery) {
      res.status(404).json({ message: "Delivery not found" });
      return;
    }

    res.json(delivery);
  },
);

deliveriesRouter.get(
  "/reviewed/:id",
  authMiddleware({ neededRoles: [UserRole.MANAGER] }),
  async (req, res) => {
    const ds = await getDataSource();
    const id = req.params.id;

    const delivery = await ds.manager.findOne(DeliveryEnt, {
      relations: ["userDeliveries", "userDeliveries.user"],
      where: [{
        id,
        userDeliveries: {
          status: StatusUserDelivery.accepted
        }
      },
      {
        id,
        userDeliveries: {
          status: StatusUserDelivery.refused
        }
      },]
    });

    if (!delivery) {
      res.status(404).json({ message: "Delivery not found" });
      return;
    }

    res.json(delivery);
  },
);

deliveriesRouter.post(
  "/update-status/:id",
  updateParametersMiddleware,
  async (req, res) => {
    const { userId, statusChange } = req.body;
    const deliveryId = req.params.id;
    const changedDelivery = await updateDeliveryStatus({
      userId,
      deliveryId,
      statusChange,
    });

    res.json({ changedDelivery });
  },
);
