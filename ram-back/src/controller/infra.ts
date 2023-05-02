// (c) Delta Software 2023, rights reserved.

import { Router } from "express";
import { getDataSource } from "../arch/db-client";
import { getS3Api } from "../arch/s3-client";
import { UserEnt } from "../entities/user.entity";

export const infraRouter = Router();

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
  const objectKey = ".test-object";

  const objects = await s3.listObjects();
  const objectExists = objects.some((o) => o === objectKey);

  if (!objectExists) {
    await s3.putObject(objectKey, Buffer.from("test"));
  }

  await s3.removeObject(objectKey);

  res.send("OK");
});
