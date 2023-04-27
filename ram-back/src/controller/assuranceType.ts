// (c) Delta Software 2023, rights reserved.

import { Router, RequestHandler } from "express";
import { createAssuranceType } from "../app/assuranceType";
import { getDataSource } from "../arch/db-client";
import { AssuranceTypeEnt } from "../entities/assurance-type.entity";
export const assuranceTypeRouter = Router();
import * as j from "joi";
import { authMiddleware } from "./user";

const userParameters = j.object({
  name: j.string().required(),
  description: j.string().required(),
});

const saleParametersMiddleware: RequestHandler = (req, res, next) => {
  const { error } = userParameters.validate(req.body);
  if (error) {
    res.status(400).json({ message: "BAD_DATA", reason: error });
    return;
  }
  next();
};

assuranceTypeRouter.post(
  "/create",
  authMiddleware(),
  saleParametersMiddleware,
  async (req, res) => {
    const { name, description } = req.body;
    const { assuranceType, error } = await createAssuranceType({
      name,
      description,
    });

    if (error) {
      res.status(400).json({ message: error });
      return;
    }

    res.status(201).json(assuranceType);
  },
);

assuranceTypeRouter.get("/all", async (req, res) => {
  const db = await getDataSource();
  const assuranceTypes = await db.manager.find(AssuranceTypeEnt);
  res.json({ assuranceTypes });
});
