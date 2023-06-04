// (c) Delta Software 2023, rights reserved.

import { v4 } from "uuid";
import { getDataSource } from "../arch/db-client";
import { StatusEnt, StatusNames } from "../entities/status.entity";

export enum StatusError {
  STATUS_ERROR = "DEFAULT_ERROR",
}

/**
 * This function creates a new status entity with a given name and returns it, or returns an error if
 * there was a problem.
 * @param params - The function `createStatus` takes in an object `params` as its parameter. The
 * `params` object has one property `statusName`, which is of type `StatusNames`.
 * @returns The function `createStatus` returns a Promise that resolves to an object with a `status`
 * property and an optional `error` or `reason` property. The `status` property contains a `StatusEnt`
 * object that represents the newly created status. If there was an error during the creation process,
 * the `error` property will contain a `StatusError` value and the `reason` property
 */
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

/**
 * This TypeScript function retrieves the status of a data source and returns it as a Promise, along
 * with any errors encountered.
 * @returns The `getStatus` function returns a Promise that resolves to an object with the following
 * properties:
 * - `status`: an array of `StatusEnt` objects.
 * - `error`: an optional `StatusError` value if there was an error retrieving the status.
 * - `reason`: an optional `Error` object that provides more information about the error.
 */
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
