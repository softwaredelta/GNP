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
import { UploadedObjectInfo } from "minio";
import { Readable } from "stream";

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

function makeTestS3Client(): S3Config {
  const objects = new Map<string, Buffer>();
  const client = new Object() as Minio.Client;

  // TODO:
  // - add options to fail on certain conditions
  // - add options to return certain data
  client.putObject = async function putObject(
    bucketName: string,
    objectName: string,
    _stream: string | Readable | Buffer,
  ): Promise<UploadedObjectInfo> {
    if (typeof _stream === "string") {
      objects.set(objectName, Buffer.from(_stream));
    } else if (_stream instanceof Buffer) {
      objects.set(objectName, _stream);
    } else {
      const buf = [];
      for await (const chunk of _stream) {
        buf.push(chunk);
      }
      objects.set(objectName, Buffer.concat(buf));
    }
    return new Object() as UploadedObjectInfo;
  };

  client.getObject = async function getObject(
    bucketName: string,
    objectName: string,
  ): Promise<Readable> {
    if (!objects.has(objectName)) {
      throw new Error("Object not found");
    }

    const stream = new Readable();
    stream.push(objects.get(objectName));
    stream.push(null);
    return stream;
  };

  return {
    client,
    bucket: "test-bucket",
  };
}

export async function getS3Client(): Promise<S3Config> {
  if (s3Config) {
    return s3Config;
  }

  if (process.env.NODE_ENV === "test") {
    s3Config = makeTestS3Client();
  } else if (process.env.NODE_ENV === "aws") {
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
