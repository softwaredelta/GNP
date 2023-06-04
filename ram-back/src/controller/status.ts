// (c) Delta Software 2023, rights reserved.

import { Router } from "express";
export const statusRouter = Router();
import { authMiddleware } from "./user";
import { getStatus } from "../app/status";

/* This code defines a route for the `/all` endpoint on the `statusRouter` object. The route is
accessed using the HTTP GET method. The `authMiddleware` function is used as middleware to
authenticate the user before allowing access to the route. */
statusRouter.get("/all", authMiddleware(), async (req, res) => {
  const { user } = req;

  if (!user) {
    res.status(401).json({ message: "BAD_DATA" });
    return;
  }

  const { status, error, reason } = await getStatus();

  if (error) {
    res.status(400).json({ message: error, reason });
    return;
  }

  res.status(201).json(status);
});
