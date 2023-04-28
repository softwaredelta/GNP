// (c) Delta Software 2023, rights reserved.

import { Router } from "express";
import { getS3Api } from "../arch/s3-client";

/**
 * When s3 is mocked locally, we need this route to serve files to the frontend.
 * No signed url is needed, just the file name.
 */

export const filesRouter = Router();

filesRouter.get("/:filename", async (req, res) => {
  const s3 = await getS3Api();
  const { filename } = req.params;
  const isPdf = filename.toLowerCase().endsWith(".pdf");

  const object = await s3.getObject(filename);
  if (isPdf) {
    res.setHeader("Content-Type", "application/pdf");
  }

  object.pipe(res);
});
