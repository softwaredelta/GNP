// (c) Delta Software 2023, rights reserved.

import { getDataSource } from "../arch/db-client";
import { AssuranceTypeEnt } from "../entities/assurance-type.entity";
import { v4 } from "uuid";

export enum AssuranceTypeError {
  ASSURANCE_TYPE_ERROR = "DEFAULT_ERROR",
}

export async function createAssuranceType(params: {
  name: string;
  description: string;
  id?: string;
}): Promise<{ assuranceType: AssuranceTypeEnt; error?: AssuranceTypeError }> {
  const ds = await getDataSource();
  const id = params.id || v4();

  return ds.manager
    .save(AssuranceTypeEnt, {
      id,
      name: params.name,
      description: params.description,
    })
    .then((assuranceType) => {
      return { assuranceType };
    })
    .catch(() => {
      return {
        assuranceType: {} as AssuranceTypeEnt,
        error: AssuranceTypeError.ASSURANCE_TYPE_ERROR,
      };
    });
}
