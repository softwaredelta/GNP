// (c) Delta Software 2023, rights reserved.

import { Router, RequestHandler } from "express";
import { createSale, updateSale } from "../app/sale";
export const salesRouter = Router();
import * as j from "joi";
import { getDataSource } from "../arch/db-client";
import { SellEnt } from "../entities/sell.entity";
import { authMiddleware } from "./user";
import multer from "multer";
import { uploadFile } from "../app/file";

const upload = multer();

const saleParameters = j.object({
  policyNumber: j.number().required(),
  paidDate: j.string().required(),
  yearlyFee: j.number().required(),
  contractingClient: j.string().required(),
  assuranceTypeId: j.string().required(),
  periodicity: j.string().required(),
  emissionDate: j.string().required(),
  insuredCostumer: j.string().required(),
  paidFee: j.number().required(),
});

const saleUpdateParameters = j.object({
  statusChange: j.string().required(),
});

const saleParametersMiddleware: RequestHandler = (req, res, next) => {
  const { error } = saleParameters.validate(req.body, {
    abortEarly: false,
  });
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
  upload.single("file"),
  saleParametersMiddleware,
  async (req, res) => {
    const {
      policyNumber,
      paidDate,
      yearlyFee,
      contractingClient,
      assuranceTypeId,
      periodicity,
      emissionDate,
      insuredCostumer,
      paidFee,
    } = req.body;
    const { user } = req;

    if (!user) {
      res.status(401).json({ message: "BAD_DATA" });
      return;
    }

    if (!req.file) {
      res.status(400).json({ message: "NO_FILE_UPLOAD" });
      return;
    }

    const evidenceUrl: string = await uploadFile({ file: req.file });

    const { sale, error, reason } = await createSale({
      policyNumber,
      paidDate,
      yearlyFee,
      contractingClient,
      assuranceTypeId,
      userId: user.id,
      periodicity,
      emissionDate,
      insuredCostumer,
      paidFee,
      evidenceUrl,
    });

    if (error) {
      res.status(500).json({ message: error });
      console.error(reason);
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

salesRouter.post("/update/:id", authMiddleware(), async (req, res) => {
  const {
    policyNumber,
    paidDate,
    yearlyFee,
    contractingClient,
    assuranceTypeId,
    periodicity,
    emissionDate,
    insuredCostumer,
    paidFee,
  } = req.body;
  const { user } = req;
  if (!user) {
    res.status(401).json({ message: "NO_USER" });
    return;
  }
  const { sale, error } = await updateSale({
    id: req.params.id,
    policyNumber,
    paidDate,
    yearlyFee,
    contractingClient,
    assuranceTypeId,
    periodicity,
    emissionDate,
    insuredCostumer,
    paidFee,
    userId: user.id,
  });

  if (error) {
    res.status(500).json({ message: error });
    return;
  }

  res.json({ sale });
});

salesRouter.get("/:id", authMiddleware(), async (req, res) => {
  const db = await getDataSource();
  const sale = await db.manager.findOne(SellEnt, {
    relations: { assuranceType: true, user: true },
    where: { id: req.params.id },
  });

  res.json(sale);
});
