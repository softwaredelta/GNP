// (c) Delta Software 2023, rights reserved.

import { Router } from "express";
import { getS3Api } from "../arch/s3-client";

export const filesRouter = Router();

/* This code defines a route handler for the `/` endpoint of the `filesRouter` router. When a GET
request is made to this endpoint, the code first checks if a `fileUrl` query parameter is present
and is a string. If not, it returns a 400 Bad Request response with a JSON error message. */

filesRouter.get("/", async (req, res) => {
  const fileUrl = req.query.fileUrl;
  if (!fileUrl || typeof fileUrl !== "string") {
    res.status(400).json({ message: "Missing fileUrl" });
    return;
  }

  const isFullUrl = fileUrl.startsWith("http");
  if (isFullUrl) {
    res.redirect(fileUrl);
    return;
  }

  if (fileUrl === "undefined") {
    res.redirect("https://picsum.photos/400");
    return;
  }

  const filename = fileUrl;
  const s3 = await getS3Api();
  const object = await s3.getObject(filename).catch(() => {
    res.status(404).json({ message: "File not found" });
    return null;
  });
  if (!object) {
    return;
  }

  const isPdf = filename.toLocaleLowerCase().endsWith(".pdf");

  if (isPdf) {
    res.setHeader("Content-Type", "application/pdf");
  }

  object.pipe(res);
});
