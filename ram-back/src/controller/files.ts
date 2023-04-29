// (c) Delta Software 2023, rights reserved.

import { Router } from "express";
import { getS3Api } from "../arch/s3-client";

export const filesRouter = Router();

// Given a filename, (no full url, only file.ext)
// 1. on mocked s3, returns file directly
// 2. on real s3, returns a signed url to the file (TODO)
filesRouter.get("/:filename", async (req, res) => {
  const s3 = await getS3Api();
  const object = await s3.getObject(req.params.filename);
  const isPdf = req.params.filename.toLocaleLowerCase().endsWith(".pdf");

  if (isPdf) {
    res.setHeader("Content-Type", "application/pdf");
  }

  object.pipe(res);
});
