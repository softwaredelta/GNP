// (c) Delta Software 2023, rights reserved.
import { Request, Response, Router } from "express";
import multer from "multer";
import { DataSource } from "typeorm";
import {
  createUserDelivery,
  getAllUserDeliveries,
  getAuthUserDelivery,
} from "../app/user-delivery";
import { getDataSource } from "../arch/db-client";
import { UserDeliveryEnt } from "../entities/user-delivery.entity";
import { authMiddleware } from "./user";
import { UserRole } from "../entities/user.entity";
import { uploadFile } from "../app/file";

export const userDeliveryRouter: Router = Router();
const upload = multer();

userDeliveryRouter.get(
  "/:id",
  authMiddleware(),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const id: string = req.params.id;
      const { userDeliveries } = await getAllUserDeliveries(id);
      res.status(200).json(userDeliveries);
    } catch (error) {
      console.error(error);
    }
  },
);
userDeliveryRouter.get(
  "/:id/auth",
  authMiddleware(),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const id: string = req.params.id;
      if (req.user) {
        const { userDelivery } = await getAuthUserDelivery(id, req.user.id);
        res.status(200).json(userDelivery);
      }
    } catch (error) {
      throw new Error(error as string);
    }
  },
);

userDeliveryRouter.get(
  "/",
  authMiddleware(),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const ds: DataSource = await getDataSource();
      const userDeliveryEntities: UserDeliveryEnt[] = await ds.manager.find(
        UserDeliveryEnt,
        { relations: ["delivery", "user"] },
      );
      res.status(200).json(userDeliveryEntities);
    } catch (error) {
      console.error(error);
    }
  },
);

userDeliveryRouter.post(
  "/upload/:id",
  authMiddleware({ neededRoles: [UserRole.REGULAR] }),
  upload.single("file"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (req.user && req.file) {
        const id: string = req.params.id;
        const filename: string = await uploadFile({ file: req.file });
        const createdUserDelivery: UserDeliveryEnt = await createUserDelivery({
          userId: req.user.id,
          deliveryId: id,
          status: "Enviado",
          fileUrl: filename,
          dateDelivery: new Date(),
        });
        res.status(201).json(createdUserDelivery);
      } else {
        res.status(400).json({ message: "BAD_DATA" });
      }
    } catch (error) {
      console.error(error);
    }
  },
);
