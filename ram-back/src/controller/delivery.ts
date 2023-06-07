// (c) Delta Software 2023, rights reserved.

import { Router } from "express";
import { authMiddleware } from "./user";
import { getDataSource } from "../arch/db-client";
import { DeliveryEnt } from "../entities/delivery.entity";
import { DeliveryLinkEnt } from "../entities/delivery-link.entity";
import {
  DeliveryError,
  createDelivery,
  createLinkDelivery,
  deleteDelivery,
  getDeliveryGroup,
  getUserDeliveriesbyGroup,
  setDeliveryToAllUsers,
  updateDelivery,
  updateDeliveryStatus,
  updateLinkDelivery,
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
import { uploadFile } from "../app/file";

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
  authMiddleware({ neededRoles: [UserRole.MANAGER || UserRole.REGULAR] }),
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
      return;
    }

    await setDeliveryToAllUsers({
      idDelivery: delivery.id,
      idGroup: req.params.groupId,
      fileUrl: delivery.imageUrl,
      status: StatusUserDelivery.withoutSending,
      dateDelivery: new Date(),
    });

    res.status(201).json({ delivery });
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

deliveriesRouter.get(
  "/group-delivery/:deliveryId",
  authMiddleware(),
  async (req, res) => {
    if (!req.user) {
      res.status(401).json({ message: "No user" });
      return;
    }

    const deliveryId = req.params.deliveryId;

    const { delivery, error } = await getDeliveryGroup({
      deliveryId,
    });

    if (error) {
      throw new Error(error);
    }

    res.json(delivery);
  },
);

deliveriesRouter.post(
  "/delete-delivery-link",
  authMiddleware(),
  async (req, res) => {
    if (!req.body.id) {
      res.status(400).json({ message: "El campo 'id' es requerido." });
      return;
    }

    try {
      const db = await getDataSource();
      const result = await db.manager
        .getRepository(DeliveryLinkEnt)
        .delete(req.body.id);

      res.json({ links: result });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Ocurrió un error al eliminar el enlace." });
    }
  },
);

deliveriesRouter.post(
  "/create-delivery-link/:deliveryId",
  authMiddleware({ neededRoles: [UserRole.MANAGER] }),
  async (req, res) => {
    const deliveryId = req.params.deliveryId;
    const { link, name } = req.body;

    const data = await createLinkDelivery({
      deliveryId,
      link,
      name,
    });

    const { link: link2, error } = data;
    if (error) {
      res.status(500).json({ error });
      return;
    } else {
      res.json(link2);
    }
  },
);

deliveriesRouter.post(
  "/update-delivery-link",
  authMiddleware(),
  async (req, res) => {
    const { link, name, id } = req.body;
    const changedLink = await updateLinkDelivery({
      id,
      link,
      name,
    });

    res.json({ changedLink });
  },
);

deliveriesRouter.post(
  "/update-status-no-evidence/:deliveryId",
  authMiddleware({ neededRoles: [UserRole.REGULAR] }),
  async (req, res) => {
    if (!req.body) {
      res.status(400).json({ message: "No deliveryId" });
      return;
    }
    const deliveryId = req.params.deliveryId;
    if (!req.user) {
      res.status(401).json({ message: "No user" });
      return;
    }
    const userId = req.user.id;

    const changedDelivery = await updateDeliveryStatus({
      userId,
      deliveryId,
      statusChange: true,
    });
    res.json(changedDelivery);
  },
);

deliveriesRouter.post(
  "/:id",
  authMiddleware({ neededRoles: [UserRole.MANAGER] }),
  upload.single("image"),
  async (req, res) => {
    const schema = j.object({
      deliveryName: j.string().optional(),
      description: j.string().optional(),
      hasDelivery: j.string().optional(),
    });
    const { error: validationError } = schema.validate(req.body);
    if (validationError) {
      res.status(400).json({ message: "BAD_DATA", reason: validationError });
      return;
    }

    const body = req.body;
    const file = req.file;
    const id = req.params.id;

    if (!file && !body.deliveryName && !body.description) {
      res.status(400).json({ message: "BAD_DATA" });
      return;
    }

    const imageUrl = await (async () => {
      if (!file) return undefined;
      return uploadFile({ file });
    })();

    const { delivery, error, errorReason } = await updateDelivery({
      deliveryId: id,
      deliveryName: body.deliveryName,
      description: body.description,
      imageUrl,
      hasDelivery: body.hasDelivery,
    });

    if (error && error === DeliveryError.NOT_FOUND) {
      res.status(404).json({ error });
      return;
    }
    if (error) {
      res.status(500).json({ error: validationError, errorReason });
      console.error(errorReason);
      return;
    }

    res.json(delivery);
  },
);
