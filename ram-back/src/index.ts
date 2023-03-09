// (c) Delta Software 2023, rights reserved.

import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app: Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.listen(3000, (): void => {
  console.log("Server listening...");
});
