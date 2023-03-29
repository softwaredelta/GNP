// (c) Delta Software 2023, rights reserved.
/**
 * This file abstracts all S3 details away from functional code.
 *
 * Summary:
 * - For local or remote:
 *  - We use minio as the S3 server
 *  - We setup the bucket ourselves since this are test environments
 * - For AWS:
 *  - We use the AWS S3 server
 *  - We use the runnning instance credentials
 *  - We use the bucket created by the cloudformation template
 * - In all cases, we lazy-init the client and bucket if needed
 */

import * as Minio from "minio";
import { fromInstanceMetadata } from "@aws-sdk/credential-providers";

// config variable, store client and bucket name
export interface S3Config {
  bucket: string;
  client: Minio.Client;
}

let s3Config: S3Config | null = null;

async function makeAwsS3Client(): Promise<S3Config> {
  // TODO: handle expiry
  const awsCredentials = await fromInstanceMetadata()();

  const client = new Minio.Client({
    endPoint: "s3.amazonaws.com",
    accessKey: awsCredentials.accessKeyId,
    secretKey: awsCredentials.secretAccessKey,
    sessionToken: awsCredentials.sessionToken,
  });

  const bucket = process.env.S3_BUCKET_NAME || "";

  return { client, bucket };
}

async function makeMinioClient(
  accessKey: string,
  secretKey: string,
  bucket: string,
): Promise<S3Config> {
  const client = new Minio.Client({
    accessKey,
    secretKey,
    useSSL: false,
    endPoint: "localhost",
    port: 9000,
  });

  // create bucket if it doesn't exist
  const bucketExists = await client.bucketExists(bucket);
  if (!bucketExists) {
    await client.makeBucket(bucket);
  }

  return { client, bucket };
}

export async function getS3Client(): Promise<S3Config> {
  if (s3Config) {
    return s3Config;
  }

  if (process.env.NODE_ENV === "aws") {
    s3Config = await makeAwsS3Client();
  } else if (process.env.NODE_ENV === "remote") {
    s3Config = await makeMinioClient(
      process.env.MINIO_ROOT_USER || "",
      process.env.MINIO_ROOT_PASSWORD || "",
      "appdata",
    );
  } else if (!process.env.NODE_ENV) {
    s3Config = await makeMinioClient("root", "rootroot", "appdata");
  } else {
    throw new Error("Unknown environment");
  }

  return s3Config;
}
