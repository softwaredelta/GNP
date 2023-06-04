// (c) Delta Software 2023, rights reserved.

import "reflect-metadata";
import path from "path";
import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import { router } from "./routes";
import { getDataSource } from "../arch/db-client";
import { log } from "../app/log";


/* This code block checks if the `NODE_ENV` environment variable is not set. If it is not set, it logs
a message to the console indicating that it is using a local `.env.development` file, and then loads
the environment variables from that file using the `dotenv` package. The `path.resolve()` method is
used to get the absolute path to the `.env.development` file, which is located two directories up
from the current file (`__dirname`). This is a common practice in Node.js development to load
environment variables from a local file during development, instead of setting them directly in the
environment. */
if (!process.env.NODE_ENV) {
  console.info("Using local .env.development file");
  dotenv.config({
    path: path.resolve(__dirname, "../../../.env.development"),
  });
}

export const app: Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(process.env.API_PREFIX || "/", router);

/* This code block is defining a middleware function that handles requests that do not match any of the
defined routes. It first checks if the requested path matches the `APP_URL` environment variable (or
"/" if it is not set). If it does, it sends a 404 "Not found" response. If it does not match, it
redirects the request to the `APP_URL` environment variable (or "/" if it is not set). This is a
fallback mechanism to ensure that all requests are handled properly, even if they do not match any
of the defined routes. */
app.use((req, res) => {
  const appUrl = process.env.APP_URL || "/";

  if (req.path === appUrl) {
    return res.status(404).send("Not found");
  }

  res.redirect(process.env.APP_URL || "/");
});


/* This code block defines an error handling middleware function that will be called whenever an error
occurs in the application. It takes four parameters: `err`, `req`, `res`, and `next`. */
app.use(async (err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).send("Internal server error");
  await log("unhandled-error", err);
});

/**
 * This function starts a server listening on a specified port and initializes a database connection.
 */
export const start = async () => {
  const port = process.env.API_PORT || 8080;
  app.listen(port, async () => {
    // make sure db connection is initialized
    await getDataSource();
    console.log("Server listening on port " + port);
  });
};
