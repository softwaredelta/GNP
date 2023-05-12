// (c) Delta Software 2023, rights reserved.

import { Router } from "express";
import { getS3Api } from "../arch/s3-client";

export const filesRouter = Router();

// Send user to file
// 1. On full urls, redirect to the file
// 2. On filename
// 2.1. On mocked s3, send file ourselves
// 2.2. On real s3, redirect to the file with a signed url (TODO)
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
