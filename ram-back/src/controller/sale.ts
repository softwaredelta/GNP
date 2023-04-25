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
  assuranceTypeId: j.string().required(),
  sellDate: j.string().required(),
  amountInCents: j.string().required(),
  clientName: j.string().required(),
  periodicity: j.string().required(),
});

const saleParametersMiddleware: RequestHandler = (req, res, next) => {
  const { error } = userParameters.validate(req.body);
  if (error) {
    res.status(400).json({ message: "BAD_DATA", reason: error });
    return;
  }
  next();
};

salesRouter.post("/create", saleParametersMiddleware, async (req, res) => {
  const {
    policyNumber,
    assuranceType,
    sellDate,
    amountInCents,
    clientName,
    periodicity,
  } = req.body;
  const { sale, error } = await createSale({
    policyNumber,
    assuranceType,
    sellDate,
    amountInCents,
    clientName,
    periodicity,
  });
  if (error) {
    //console.log(res);
    res.status(400).json({ message: error });
    return;
  }
  res.json(sale);
});

salesRouter.get("/all", async (req, res) => {
  const db = await getDataSource();
  const sales = await db.manager
    .createQueryBuilder(SellEnt, "sell")
    .leftJoinAndSelect("sell.assuranceType", "assuranceType")
    .getMany();
  res.json({ sales });
});

salesRouter.get("/delete/:id", async (req, res) => {
  const db = await getDataSource();
  const sales = await db.manager.getRepository(SellEnt)
  .delete(req.params.id)
  res.json({ sales });
});