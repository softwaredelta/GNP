// (c) Delta Software 2023, rights reserved.
import { S3Api, getS3Api } from "../arch/s3-client";
import path from "path";
import { v4 as uuid } from "uuid";

/**
 * This function uploads a file to an S3 bucket and returns the filename.
 * @param params - The function `uploadFile` takes in an object `params` as its parameter, which has
 * one property `file`. The `file` property is of type `Express.Multer.File`, which is an interface for
 * files uploaded using the Multer middleware in an Express.js application.
 * @returns a string, which is the filename of the uploaded file.
 */
export async function uploadFile(params: {
  file: Express.Multer.File;
}): Promise<string> {
  const { file } = params;
  const newFile: Express.Multer.File = file;
  const s3: S3Api = await getS3Api();
  const id = uuid();
  const filename = `${id}-${Date.now()}${path.extname(newFile.originalname)}`;
  await s3.putObject(filename, newFile.buffer);

  return filename;
}
