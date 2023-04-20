// (c) Delta Software 2023, rights reserved.

import { Router, RequestHandler } from "express";
import { createSale } from "../app/sale";
export const salesRouter = Router();
import * as j from "joi";

const userParameters = j.object({
  policyNumber: j.string().required(),
  assuranceType: j.string().required(),
  sellDate: j.string().required(),
  amountInCents: j.string().required(),
  clientName: j.string().required(),
});

const saleParametersMiddleware: RequestHandler = (req, res) => {
  const { error } = userParameters.validate(req.body);
  if (error) {
    res.status(400).json({ message: "BAD_DATA", reason: error });
    return;
  }
};

salesRouter.post("/create", saleParametersMiddleware, async (req, res) => {
  const { policyNumber, assuranceType, sellDate, amountInCents, clientName } =
    req.body;
  const { sale, error } = await createSale({
    policyNumber,
    assuranceType,
    sellDate,
    amountInCents,
    clientName,
  });
  if (error) {
    res.status(400).json({ message: error });
    return;
  }
  res.json(sale);
});
