// (c) Delta Software 2023, rights reserved.

import { RequestHandler, Router } from "express";
import * as j from "joi";
import {
  createProspect,
  getProspectStatus,
  getProspectsByAgent,
  modifyProspect,
} from "../app/prospect";
import { getAgentById } from "../app/user";
import { getDataSource } from "../arch/db-client";
import { ProspectEnt } from "../entities/prospect.entity";
import { authMiddleware } from "./user";
export const prospectRouter = Router();

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

prospectRouter.get("/my-prospects", authMiddleware(), async (req, res) => {
  const { user } = req;
  if (!user) {
    res.status(401).json({ message: "No user" });
    return;
  }

  const userId = user.id;

  const { prospects, error, reason } = await getProspectStatus({ userId });

  if (error) {
    res.status(400).json({ message: error, reason });
    return;
  }

  res.status(200).json({ prospects });
  return;
});

prospectRouter.get("/count-prospects-new/:id", async (req, res) => {
  const db = await getDataSource();
  const id = req.params.id;
  const agents = await db.manager.count(ProspectEnt, {
    where: {
      userId: id,
    },
  });
  res.json(agents);
});

prospectRouter.get("/get-agentprospect/:id", async (req, res) => {
  const agentId = req.params.id;

  const { prospects, error, reason } = await getProspectsByAgent({ agentId });

  if (error) {
    res.status(400).json({ message: error, reason });
    return;
  }

  const agentName = await getAgentById(agentId);
  res.status(200).json({ agentName, prospects });
});

prospectRouter.post("/update-prospect", authMiddleware(), async (req, res) => {
  const { statusId, statusComment, prospectId } = req.body;
  const { user } = req;

  if (!user) {
    res.status(401).json({ message: "BAD_DATA" });
    return;
  }

  const { prospect, error, reason } = await modifyProspect({
    prospectId,
    statusId,
    statusComment,
  });

  if (error) {
    console.log(error);
    res.status(400).json({ message: error, reason });
    return;
  }

  res.status(200).json(prospect);
});
