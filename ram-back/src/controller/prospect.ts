import { Router } from "express";
import { authMiddleware } from "./user";
import { getDataSource } from "../arch/db-client";
import { ProspectEnt } from "../entities/prospect.entity";
import { UserRole } from "../entities/user.entity";
import { UserEnt } from "../entities/user.entity";

import * as j from "joi";
import { RequestHandler } from "express";

export const prospectsRouter = Router();


const updateParameters = j.object({
    userId: j.string().required(),
    statusChange: j.boolean().required(),
  });

  prospectsRouter.get("/agents", authMiddleware(), async (req, res) => {
    if (!req.user) {
      res.status(401).json({ message: "No user" });
      return;
    }
    const userId = req.user.id;
    const db = await getDataSource();
    const sales = await db.manager.find(SellEnt, {
      relations: { assuranceType: true, user: true },
      where: { userId },
    });
  
    res.json(sales);
  });
  