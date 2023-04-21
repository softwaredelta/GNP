// (c) Delta Software 2023, rights reserved.
import { Request, Response, Router } from "express";
import { getUserDelivery } from "../app/user-delivery";
import { DataSource } from "typeorm";
import { getDataSource } from "../arch/db-client";
import { UserDeliveryEnt } from "../entities/user-delivery";

export const userDeliveryRouter: Router = Router();

userDeliveryRouter.get(
  "/:id",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const id: string = req.params.id;
      const { userDelivery } = await getUserDelivery(id);
      res.status(200).json(userDelivery);
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

// userDeliveryRouter.post(
//   "/:id/send",
//   async (req: Request, res: Response): void => {
//     try {
//     } catch (error) {
//       console.error(error);
//     }
//   },
// );

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
