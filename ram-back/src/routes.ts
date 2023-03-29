// (c) Delta Software 2023, rights reserved.

import { BucketItem } from "minio";
import { getS3Client } from "./arch/s3-client";
import { getDbClient } from "./arch/db-client";
import { Router } from "express";

export const router = Router();

router.get("/", (_req, res) => {
  res.send("Hello World!");
});

router.get("/health", (_req, res) => {
  res.send("OK");
});

// demonstrates connection with DB
router.get("/time", async (_req, res) => {
  const client = getDbClient();
  client.connect();
  const data = await client.query("SELECT NOW()");
  client.end();
  res.json(data.rows[0]);
});

// demonstrates connection with S3
router.get("/objects", async (_req, res) => {
  const { client, bucket } = await getS3Client();
  const objects = await client.listObjectsV2(bucket);
  const d: Array<BucketItem> = [];
  objects.on("data", (i) => d.push(i));
  objects.on("end", () => res.json(d));
});
