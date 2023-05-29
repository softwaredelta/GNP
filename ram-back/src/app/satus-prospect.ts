// (c) Delta Software 2023, rights reserved.

import { getDataSource } from "../arch/db-client";
import { ProspectStatusEnt } from "../entities/prospect-status.entity";

export enum ProspectStatusError {
  STATUSPROSPECT_ERROR = "DEFAULT_ERROR",
}

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

export async function getProspectStatus(params: {
  prospectId: string;
}): Promise<ProspectStatusEnt[]> {
  const ds = await getDataSource();

  const { prospectId } = params;

  return ds.manager
    .find(ProspectStatusEnt, {
      where: { prospectId },
      relations: ["status"],
    })
    .then((prospectStatus) => {
      return prospectStatus;
    })
    .catch((e) => {
      console.log(e);
      return [];
    });
}
