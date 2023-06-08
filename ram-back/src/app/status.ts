// (c) Delta Software 2023, rights reserved.

import { v4 } from "uuid";
import { getDataSource } from "../arch/db-client";
import { StatusEnt, StatusNames } from "../entities/status.entity";

export enum StatusError {
  STATUS_ERROR = "DEFAULT_ERROR",
}

export async function createStatus(params: {
  statusName: StatusNames;
}): Promise<{ status: StatusEnt; error?: StatusError; reason?: Error }> {
  const ds = await getDataSource();

  const statusName = params.statusName;
  const id = v4();

  return ds.manager
    .save(
      ds.manager.create(StatusEnt, {
        statusName,
        id,
      }),
    )
    .then((status) => {
      return { status };
    })
    .catch((e) => {
      return {
        status: {} as StatusEnt,
        error: StatusError.STATUS_ERROR,
        reason: e,
      };
    });
}

export async function getStatus(): Promise<{
  status: StatusEnt[];
  error?: StatusError;
  reason?: Error;
}> {
  const ds = await getDataSource();

  return ds.manager
    .find(StatusEnt)
    .then((status) => {
      return { status };
    })
    .catch((e) => {
      return {
        status: [] as StatusEnt[],
        error: StatusError.STATUS_ERROR,
        reason: e,
      };
    });
}
