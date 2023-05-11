import { Router } from "express";
import { authMiddleware } from "./user";
import { getDataSource } from "../arch/db-client";
import { ProspectEnt } from "../entities/prospect.entity";
import { UserRole } from "../entities/user.entity";

import * as j from "joi";
import { RequestHandler } from "express";

export const prospectsRouter = Router();


const updateParameters = j.object({
    userId: j.string().required(),
    statusChange: j.boolean().required(),
  });

prospectsRouter.get(
    "/reviewed/:id",
    authMiddleware({ neededRoles: [UserRole.MANAGER] }),
    async (req, res) => {
      const ds = await getDataSource();
      const id = req.params.id;
  
      const delivery = await ds.manager.findOne(ProspectEnt, {
        relations: ["userDeliveries", "userDeliveries.user"],
        where: [
          
        ],
      });
  
      if (!delivery) {
        res.status(404).json({ message: "Delivery not found" });
        return;
      }
  
      res.json(delivery);
    },
  );