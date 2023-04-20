// (c) Delta Software 2023, rights reserved.

import { Router, RequestHandler } from "express";
import { createSale } from "../app/sale";
export const salesRouter = Router();
import * as j from "joi";

const userParameters = j.object({
  policyNumber: j.string().required(),
<<<<<<< HEAD
  assuranceType: j.object().required(),
=======
  assuranceType: j.string().required(),
>>>>>>> 23639a06391f34e99408a102d8ab1c7dc352d37e
  sellDate: j.string().required(),
  amountInCents: j.string().required(),
  clientName: j.string().required(),
});

<<<<<<< HEAD
const saleParametersMiddleware: RequestHandler = (req, res, next) => {
=======
const saleParametersMiddleware: RequestHandler = (req, res) => {
>>>>>>> 23639a06391f34e99408a102d8ab1c7dc352d37e
  const { error } = userParameters.validate(req.body);
  if (error) {
    res.status(400).json({ message: "BAD_DATA", reason: error });
    return;
  }
<<<<<<< HEAD
  next();
=======
>>>>>>> 23639a06391f34e99408a102d8ab1c7dc352d37e
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
