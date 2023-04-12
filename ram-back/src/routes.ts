// (c) Delta Software 2023, rights reserved.

import { BucketItem } from "minio";
import { getS3Client } from "./arch/s3-client";
import { getDataSource } from "./arch/db-client";
import { Router } from "express";
import { UserEnt } from "./entities/user.entity";

export const router = Router();

router.get("/", (_req, res) => {
  res.send("Hello World!");
});

router.get("/health", (_req, res) => {
  res.send("OK");
});

// demonstrates connection with DB
router.get("/time", async (_req, res) => {
  const ds = await getDataSource();
  const data = await ds.query("SELECT NOW()");
  res.json(data[0]);
});

// demonstrates connection with S3
router.get("/objects", async (_req, res) => {
  const { client, bucket } = await getS3Client();
  const objects = await client.listObjectsV2(bucket);
  const d: Array<BucketItem> = [];
  objects.on("data", (i) => d.push(i));
  objects.on("end", () => res.json(d));
});

router.post("/user", async (req, res) => {
  const ds = await getDataSource();
  const { email } = req.body;
  const id = Math.random().toString(36).substring(7);
  const user = await ds.manager.save(UserEnt, { id, email });
  res.json(user);
});

router.get("/user", async (req, res) => {
  const ds = await getDataSource();
  const users = await ds.manager.find(UserEnt);
  res.json(users);
});
