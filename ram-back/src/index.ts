// (c) Delta Software 2023, rights reserved.

import path from "path";
import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import { router } from "./routes";

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

app.use(process.env.API_PREFIX || "/", router);

app.use((req, res) => {
  res.redirect(process.env.APP_URL || "/");
});

const port = process.env.API_PORT || 8080;
app.listen(port, (): void => {
  console.log("Server listening on port " + port);
});
