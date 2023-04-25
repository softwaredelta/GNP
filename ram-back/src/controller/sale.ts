// (c) Delta Software 2023, rights reserved.

import { Router, RequestHandler } from "express";
import { createSale } from "../app/sale";
export const salesRouter = Router();
import * as j from "joi";
import { getDataSource } from "../arch/db-client";
import { SellEnt } from "../entities/sell.entity";
import { authMiddleware } from "./user";


const userParameters = j.object({
  policyNumber: j.string().required(),
  sellDate: j.string().required(),
  amountInCents: j.string().required(),
  clientName: j.string().required(),
  assuranceType: j.object().required(),
});

const saleParametersMiddleware: RequestHandler = (req, res, next) => {
  const { error } = userParameters.validate(req.body);
  if (error) {
    res.status(400).json({ message: "BAD_DATA", reason: error });
    return;
  }
  next();
};

salesRouter.post(
  "/create",
  authMiddleware,
  saleParametersMiddleware,
  async (req, res) => {
    const { policyNumber, sellDate, amountInCents, clientName, assuranceType } =
      req.body;
    const { user } = req;

    if (!user) {
      res.status(401).json({ message: "BAD_DATA" });
      return;
    }

    const { sale, error } = await createSale({
      policyNumber,
      sellDate,
      amountInCents,
      clientName,
      assuranceType,
      user,
    });

    if (error) {
      res.status(400).json({ message: error });
      return;
    }

    res.status(201).json(sale);
  },
);

salesRouter.get("/all", async (req, res) => {
  const db = await getDataSource();
  const sales = await db.manager
    .createQueryBuilder(SellEnt, "sell")
    .leftJoinAndSelect("sell.assuranceType", "assuranceType")
    .getMany();
  res.json({ sales });
});
