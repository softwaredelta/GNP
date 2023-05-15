// (c) Delta Software 2023, rights reserved.

import { RequestHandler, Router } from "express";
export const prospectRouter = Router();
import * as j from "joi";
import { authMiddleware } from "./user";
import { createProspect } from "../app/prospect";
import { getDataSource } from "../arch/db-client";
import { ProspectEnt } from "../entities/prospect.entity";
// import { StatusNames } from "../entities/status.entity";
// import { ProspectStatusEnt } from "../entities/prospect-status.entity";

const prospectParameters = j.object({
  name: j.string().required(),
  firstSurname: j.string().required(),
  secondSurname: j.string().required(),
  comentary: j.string().optional(),
  statusId: j.string().optional(),
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
    const { name, firstSurname, secondSurname, comentary, statusId } = req.body;
    const { user } = req;

    if (!user) {
      res.status(401).json({ message: "BAD_DATA" });
      return;
    }

    const { prospect, error, reason } = await createProspect({
      name,
      firstSurname,
      secondSurname,
      comentary,
      statusId,
      userId: user.id,
    });

    if (error) {
      res.status(400).json({ message: error, reason });
      return;
    }

    res.status(201).json(prospect);
  },
);
prospectRouter.get("/count-prospects-new/:id", async (req, res) => {
  const db = await getDataSource();
  const id = req.params.id;
  // const status = StatusNames.NEW;
  const sales = await db.manager.count(ProspectEnt, {
    // relations: ["prospect_status", "prospect_status.prospect"],
    where: {
      userId: id,
      // prospectStatus: StatusNames.NEW,
      // prospect_status:{
      //   statusId: StatusNames.NEW
      // }
    },
  });
  res.json(sales);
});
