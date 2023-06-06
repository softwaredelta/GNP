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

/* This code defines a GET endpoint for the user delivery router that takes an `id` parameter in the
URL path. When a request is made to this endpoint, it calls the `getAllUserDeliveries` function with
the `id` parameter to retrieve all user deliveries associated with that `id`. It then sends a JSON
response with the retrieved user deliveries and sets the HTTP status code to 200. If an error
occurs, it logs the error to the console. */
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

/* This code defines a GET endpoint for the user delivery router that requires authentication using the
`authMiddleware()` function. It takes an `id` parameter in the URL path and retrieves the user
delivery associated with that `id` and the authenticated user's `id` using the
`getAuthUserDelivery()` function. If the authenticated user is authorized to access the user
delivery, it sends a JSON response with the retrieved user delivery and sets the HTTP status code to
200. If an error occurs, it throws an error with the error message. */
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

/* This code defines a GET endpoint for the user delivery router that retrieves all user deliveries
from the database. It uses the `getDataSource()` function to get a connection to the database, then
uses the `find()` method of the `manager` object to retrieve all `UserDeliveryEnt` entities with
their associated `DeliveryEnt` and `UserEnt` entities. It then sends a JSON response with the
retrieved user deliveries and sets the HTTP status code to 200. If an error occurs, it logs the
error to the console. */
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

/* This code defines a POST endpoint for the user delivery router that requires authentication using
the `authMiddleware()` function with the `neededRoles` option set to `[UserRole.REGULAR]`. It takes
an `id` parameter in the URL path and an uploaded file with the name `file`. When a request is made
to this endpoint, it checks if the authenticated user has the required role and if a file was
uploaded. If both conditions are met, it calls the `uploadFile()` function to upload the file and
retrieves the filename. It then calls the `createUserDelivery()` function with the authenticated
user's `id`, the `id` parameter, the retrieved filename, and other data to create a new user
delivery entity in the database. Finally, it sends a JSON response with the created user delivery
entity and sets the HTTP status code to 201. If the conditions are not met, it sends a JSON response
with a `BAD_DATA` message and sets the HTTP status code to 400. If an error occurs, it logs the
error to the console. */
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
          status: "Aceptado",
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
