// (c) Delta Software 2023, rights reserved.
import { S3Api, getS3Api } from "../arch/s3-client";
import path from "path";
import { v4 as uuid } from "uuid";

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
