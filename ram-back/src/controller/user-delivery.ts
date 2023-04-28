// (c) Delta Software 2023, rights reserved.
import { Request, Response, Router } from "express";
import multer from "multer";
import path from "path";
import { DataSource } from "typeorm";
import {
  createUserDelivery,
  getAllUserDeliveries,
  getAuthUserDelivery,
} from "../app/user-delivery";
import { getDataSource } from "../arch/db-client";
import { S3Api, getS3Api } from "../arch/s3-client";
import { UserDeliveryEnt } from "../entities/user-delivery.entity";
import { authMiddleware } from "./user";

export const userDeliveryRouter: Router = Router();
const upload = multer();

userDeliveryRouter.get(
  "/:id",
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
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const id: string = req.params.id;
      if (req.user) {
        const { userDelivery } = await getAuthUserDelivery(id, req.user.id);
        res.status(200).json(userDelivery);
      }
    } catch (error) {
      console.error(error);
    }
  },
);

userDeliveryRouter.get(
  "/",
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
  "/:id/upload",
  authMiddleware,
  upload.single("file"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (req.user && req.file) {
        const id: string = req.params.id;
        const file: Express.Multer.File = req.file;
        const s3: S3Api = await getS3Api();
        const filename: string = Date.now() + path.extname(file.originalname);
        await s3.putObject(filename, file.buffer);
        const createdUserDelivery: UserDeliveryEnt = await createUserDelivery({
          userId: req.user.id,
          deliveryId: id,
          status: "Enviado",
          fileUrl: "",
          dateDelivery: new Date(),
        });
        res.status(201).json(createdUserDelivery);
      }
    } catch (error) {
      console.error(error);
    }
  },
);
