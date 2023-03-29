// (c) Delta Software 2023, rights reserved.

import path from "path";
import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import { Client } from "pg";
import { getS3Client } from "./s3-client";

// for local development, we use the env file
if (!process.env.NODE_ENV) {
  console.info("Using local .env.development file");
  dotenv.config({
    path: path.resolve(__dirname, "../../.env.development"),
  });
}

const app: Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use((_req, res, next) => {
  console.log("Request received", _req.method, _req.path);
  next();
});

app.get("/", (_req, res) => {
  res.send("Hello World!");
});

app.get("/time", (_req, res) => {
  const client = new Client();
  client.connect();
  client.query("SELECT NOW()", (err, result) => {
    if (err) {
      res.status(500).send("Error: " + err);
    } else {
      res.send(result.rows[0]);
    }

    client.end();
  });
});

app.get("/minio", (_req, res) => {
  const client = getS3Client();
  client.listBuckets((err, buckets) => {
    if (err) {
      res.status(500).send("Error: " + err);
    } else {
      res.json(buckets);
    }
  });
});

const port = process.env.API_PORT || 8080;
app.listen(port, (): void => {
  console.log("Server listening on port " + port);
});
