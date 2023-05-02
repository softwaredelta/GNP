// (c) Delta Software 2023, rights reserved.

import { Router, RequestHandler } from "express";
import { createSale } from "../app/sale";
export const salesRouter = Router();
import * as j from "joi";
import { getDataSource } from "../arch/db-client";
import { SellEnt } from "../entities/sell.entity";
import { authMiddleware } from "./user";

const saleParameters = j.object({
  policyNumber: j.number().required(),
  sellDate: j.string().required(),
  amountInCents: j.number().required(),
  clientName: j.string().required(),
  periodicity: j.string().required(),
  evidenceUrl: j.string().required(),
  assuranceTypeId: j.string().required(),
  periodicity: j.string().required(),
});

const saleUpdateParameters = j.object({
  statusChange: j.string().required(),
});

const saleParametersMiddleware: RequestHandler = (req, res, next) => {
  const { error } = saleParameters.validate(req.body);
  if (error) {
    res.status(400).json({ message: "BAD_DATA", reason: error });
    return;
  }
  next();
};

const saleUpdateParametersMiddleware: RequestHandler = (req, res, next) => {
  const { error } = saleUpdateParameters.validate(req.body);
  if (error) {
    res.status(400).json({ message: "BAD_DATA", reason: error });
    return;
  }
  next();
};

salesRouter.post(
  "/create",
  authMiddleware(),
  saleParametersMiddleware,
  async (req, res) => {
    const {
      policyNumber,
      sellDate,
      amountInCents,
      clientName,
      assuranceTypeId,
      periodicity,
      evidenceUrl,
    } = req.body;
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
      assuranceTypeId,
      userId: user.id,
      periodicity,
      evidenceUrl,
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
  // const sales = await db.manager.find(SellEnt);
  const sales = await db.manager
    .createQueryBuilder(SellEnt, "sell")
    .leftJoinAndSelect("sell.assuranceType", "assuranceType")
    .getMany();
  res.json(sales);
});

salesRouter.post("/delete/:id", async (req, res) => {
  const db = await getDataSource();
  const sales = await db.manager.getRepository(SellEnt).delete(req.params.id);
  res.json(sales);
});

salesRouter.get("/my-sales", authMiddleware(), async (req, res) => {
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

salesRouter.get("/verify-sales", authMiddleware(), async (req, res) => {
  const db = await getDataSource();
  const sales = await db.manager.find(SellEnt, {
    relations: { user: true, assuranceType: true },
    where: { status: "sin revisar" },
  });

  res.json({ sales });
});

salesRouter.post(
  "/update-status/:id",
  authMiddleware(),
  saleUpdateParametersMiddleware,
  async (req, res) => {
    const { statusChange } = req.body;
    const db = await getDataSource();
    await db.manager
      .createQueryBuilder()
      .update(SellEnt)
      .set({ status: statusChange })
      .where("id = :id", { id: req.params.id })
      .execute();

    const changedSale = await db.manager.findOne(SellEnt, {
      relations: { user: true, assuranceType: true },
      where: { id: req.params.id },
    });

    res.json({ changedSale });
  },
);
