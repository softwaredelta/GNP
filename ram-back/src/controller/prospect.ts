// (c) Delta Software 2023, rights reserved.

import { RequestHandler, Router } from "express";
export const prospectRouter = Router();
import * as j from "joi";
import { authMiddleware } from "./user";
import { createProspect } from "../app/prospect";

const prospectParameters = j.object({
  name: j.string().required(),
  firstSurname: j.string().required(),
  secondSurname: j.string().required(),
});
const prospectParametersMiddleware: RequestHandler = (req, res, next) => {
  const { error } = prospectParameters.validate(req.body);
  if (error) {
    res.status(400).json({ message: "BAD_DATA", reason: error });
    return;
  }
  next();
};

prospectRouter.post(
  "/create",
  authMiddleware(),
  prospectParametersMiddleware,
  async (req, res) => {
    const { name, firstSurname, secondSurname } = req.body;
    const { user } = req;

    if (!user) {
      res.status(401).json({ message: "BAD_DATA" });
      return;
    }

    const { prospect, error, reason } = await createProspect({
      name,
      firstSurname,
      secondSurname,
      userId: user.id,
    });

    if (error) {
      res.status(400).json({ message: error, reason });
      return;
    }

    res.status(201).json(prospect);
  },
);
