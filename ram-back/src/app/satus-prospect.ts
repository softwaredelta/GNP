// (c) Delta Software 2023, rights reserved.

import { getDataSource } from "../arch/db-client";
import { ProspectStatusEnt } from "../entities/prospect-status.entity";

export enum ProspectStatusError {
  STATUSPROSPECT_ERROR = "DEFAULT_ERROR",
}

/**
 * This function sets the status of a prospect and returns the updated prospect status or an error if
 * there was an issue.
 * @param params - The function `setStatusToProspect` takes in an object `params` with three
 * properties: statusId of type string, prospectId of type string, statusCooment of type string.
 * @returns a Promise that resolves to an object with two properties: `prospectStatus` and either
 * `error` or `reason`.
 */
export async function setStatusToProspect(params: {
  statusId: string;
  prospectId: string;
  statusComment: string;
}): Promise<{
  prospectStatus: ProspectStatusEnt;
  error?: ProspectStatusError;
  reason?: Error;
}> {
  const ds = await getDataSource();

  const { statusId, prospectId, statusComment } = params;

  return ds.manager
    .save(
      ds.manager.create(ProspectStatusEnt, {
        statusComment,
        statusId,
        prospectId,
      }),
    )
    .then((prospectStatus) => {
      return { prospectStatus };
    })
    .catch((e) => {
      return {
        prospectStatus: {} as ProspectStatusEnt,
        error: ProspectStatusError.STATUSPROSPECT_ERROR,
        reason: e,
      };
    });
}

/**
 * This function retrieves the status history of a prospect from a data source.
 * @param params - The function `getProspectStatus` takes in an object `params` with a single property
 * `prospectId` which is a string representing the ID of a prospect.
 * @returns This function returns a Promise that resolves to an array of `ProspectStatusEnt` objects.
 * These objects represent the status history of a prospect identified by the `prospectId` parameter.
 * The function retrieves this data from a data source using the `getDataSource` function and the
 * `manager.find` method of the data source's manager object. The function also specifies that the
 * `status` relation should
 */
export async function getProspectStatus(params: {
  prospectId: string;
}): Promise<ProspectStatusEnt[]> {
  const ds = await getDataSource();

  const { prospectId } = params;

  return ds.manager
    .find(ProspectStatusEnt, {
      where: { prospectId },
      relations: ["status"],
      order: { updatedStatusDate: "DESC" },
    })
    .then((prospectStatus) => {
      return prospectStatus;
    })
    .catch((e) => {
      console.log(e);
      return [];
    });
}
