// (c) Delta Software 2023, rights reserved.
import { Request, Response, Router } from "express";
import {
  createUserDelivery,
  getAllUserDeliveries,
  getAuthUserDelivery,
} from "../app/user-delivery";
import { DataSource } from "typeorm";
import { getDataSource } from "../arch/db-client";
import { UserDeliveryEnt } from "../entities/user-delivery";
import { authMiddleware } from "./user";
import { getS3Api, S3Api } from "../arch/s3-client";
import path from "path";
import multer from "multer";

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

userDeliveryRouter.put("/:id", (req: Request, res: Response): void => {
  try {
    const id: string = req.params.id;
    // const userDelivery: UserDeliveryEnt = req.body;
    // const {userDelivery} = await updateUserDelivery(id, userDelivery);
  } catch (error) {
    console.error(error);
  }
});
userDeliveryRouter.delete("/:id", (req: Request, res: Response): void => {
  try {
  } catch (error) {
    console.error(error);
  }
});
