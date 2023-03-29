// (c) Delta Software 2023, rights reserved.

import * as Minio from "minio";

var minioClient: Minio.Client | null = null;

export function getS3Client(): Minio.Client {
  if (minioClient) {
    return minioClient;
  }

  if (!process.env.NODE_ENV) {
    // USED IN LOCAL ONLY
    minioClient = new Minio.Client({
      accessKey: "root",
      secretKey: "rootroot",
      useSSL: false,
      endPoint: "localhost",
      port: 9000,
    });

    return minioClient;
  }

  if (process.env.NODE_ENV === "remote") {
    // USED IN REMOTE ONLY
    minioClient = new Minio.Client({
      accessKey: process.env.MINIO_ROOT_USER || "",
      secretKey: process.env.MINIO_ROOT_PASSWORD || "",
      useSSL: false,
      endPoint: "localhost",
      port: 9000,
    });

    return minioClient;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("Not implemented");
  }

  throw new Error("Unknown environment");
}
