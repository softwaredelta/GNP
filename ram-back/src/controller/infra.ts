// (c) Delta Software 2023, rights reserved.

import { Router } from "express";
import { getDataSource } from "../arch/db-client";
import { getS3Api } from "../arch/s3-client";
import { UserEnt, UserRole } from "../entities/user.entity";
import { authMiddleware } from "./user";
import { LogEnt } from "../entities/log.entity";
import { v4 as uuid } from "uuid";

export const infraRouter = Router();

/**
 * DO NOT MODIFY THIS ENDPOINT
 * THE AWS DEPLOYMENT DEPENDS ON IT
 */
infraRouter.get("/health", (_req, res) => {
  res.send("OK");
});

infraRouter.get("/db", async (_req, res) => {
  const ds = await getDataSource();
  await ds.manager.find(UserEnt);
  res.send("OK");
});

infraRouter.get("/s3", async (_req, res) => {
  const s3 = await getS3Api();
  const id = uuid();

  const objectKey = `.s3-test-${id}`;

  const objects = await s3.listObjects();
  const objectExists = objects.some((o) => o === objectKey);

  if (!objectExists) {
    await s3.putObject(objectKey, Buffer.from("test"));
  }

  res.send("OK");
});

infraRouter.get(
  "/log",
  authMiddleware({ neededRoles: [UserRole.ADMIN] }),
  async (req, res) => {
    const ds = await getDataSource();
    const logs = await ds.manager.find(LogEnt);
    res.json(logs);
  },
);
