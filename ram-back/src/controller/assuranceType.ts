// (c) Delta Software 2023, rights reserved.

import { Router, RequestHandler } from "express";
import { createAssuranceType } from "../app/assuranceType";
export const assuranceTypeRouter = Router();
import * as j from "joi";

const userParameters = j.object({
    name: j.string().required(),
    description: j.string().required()
});

const saleParametersMiddleware: RequestHandler = (req, res, next) => {
  const { error } = userParameters.validate(req.body);
  if (error) {
    res.status(400).json({ message: "BAD_DATA", reason: error });
    return;
  }
  next();
};

assuranceTypeRouter.post("/create", saleParametersMiddleware, async (req, res) => {
  const {name, description} =
    req.body;
  const { assurance_type, error } = await createAssuranceType({
    name, description
  });
  if (error) {
    res.status(400).json({ message: error });
    return;
  }
  res.json(assurance_type);
});
