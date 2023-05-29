// (c) Delta Software 2023, rights reserved.
import { Router } from "express";
import { getProspectStatus } from "../app/satus-prospect";
import { authMiddleware } from "./user";

export const statusProspectRouter = Router();

statusProspectRouter.get("/:id", authMiddleware(), async (req, res) => {
  // const { user } = req;
  const prospectId = req.params.id;
  try {
    const prospectStatus = await getProspectStatus({ prospectId });
    res.status(201).json(prospectStatus);
  } catch (e) {
    res.status(400).json({ message: "BAD_DATA" });
  }
});

// statusProspectRouter.get("/:id", authMiddleware(), async (req, res) => {
//   const { user } = req;
//   const prospectId = req.params.id;
//   try {
//     const prospectStatus = await getProspectStatus({ prospectId });
//     const response = prospectStatus.map((status) => ({
//       name: status.name,
//       status: status.status,
//     }));
//     res.status(201).json(response);
//   } catch (e) {
//     res.status(400).json({ message: "BAD_DATA" });
//   }
// });
