// (c) Delta Software 2023, rights reserved.

import { Router } from "express";
import { authMiddleware } from "./user";
import { getDataSource } from "../arch/db-client";
import { DeliveryEnt } from "../entities/delivery.entity";
import {
  createDelivery,
  deleteDelivery,
  getUserDeliveriesbyGroup,
  updateDeliveryStatus,
} from "../app/deliveries";
import { UserRole } from "../entities/user.entity";
import {
  UserDeliveryEnt,
  StatusUserDelivery,
} from "../entities/user-delivery.entity";
import * as j from "joi";
import { RequestHandler } from "express";
import { getS3Api } from "../arch/s3-client";
import path from "path";
import multer from "multer";

export const deliveriesRouter = Router();

const updateParameters = j.object({
  userId: j.string().required(),
  statusChange: j.boolean().required(),
});

const upload = multer();

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
          status: StatusUserDelivery.sending,
        },
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
      where: [
        {
          id,
          userDeliveries: {
            status: StatusUserDelivery.accepted,
          },
        },
        {
          id,
          userDeliveries: {
            status: StatusUserDelivery.refused,
          },
        },
      ],
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
  authMiddleware({ neededRoles: [UserRole.MANAGER] }),
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

deliveriesRouter.post(
  "/create-delivery/:groupId",
  authMiddleware({ neededRoles: [UserRole.MANAGER] }),
  upload.single("image"),
  async (req, res) => {
    const { deliveryName, description } = req.body;
    const file = req.file;
    let data;
    if (file) {
      const s3 = await getS3Api();
      const filename: string = Date.now() + path.extname(file.originalname);
      await s3.putObject(filename, file.buffer);

      data = await createDelivery({
        idGroup: req.params.groupId,
        deliveryName,
        description,
        imageUrl: filename,
      });
    } else {
      data = await createDelivery({
        idGroup: req.params.groupId,
        deliveryName,
        description,
        imageUrl: "undefined",
      });
    }

    const { delivery, error } = data;
    if (error) {
      res.status(500).json({ error });
    } else {
      res.status(201).json({ delivery });
    }
  },
);

deliveriesRouter.delete(
  "/:id",
  authMiddleware({ neededRoles: [UserRole.MANAGER] }),
  async (req, res) => {
    const { error, reason } = await deleteDelivery({
      deliveryId: req.params.id,
    });

    if (error) {
      console.error(reason);
      res.status(500).json({ error, reason });
      return;
    }

    res.status(200).json({ message: "Delivery deleted" });
  },
);
