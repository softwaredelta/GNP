// (c) Delta Software 2023, rights reserved.

import { getDataSource } from "../arch/db-client";
import { AssuranceTypeEnt } from "../entities/assurance-type.entity";
import { v4 } from "uuid";
export enum AssuranceTypeError {
  ASSURANCE_TYPE_ERROR = "ASSURANCE_TYPE_ERROR",
}

export async function createAssuranceType(params: {
  name: string;
  description: string;
  id?: string;
}): Promise<{ assuranceType: AssuranceTypeEnt; error?: AssuranceTypeError }> {
  const ds = await getDataSource();
  const id = params.id || v4();
  //   const status = "sin revisar";
  //   const periodicity = "mensual";
  //   const evidenceUrl = "https://www.google.com";
  //   const user = createUser({ email: "user@user.test", password: "123456", id: "123456" });
  //   const createdAt = new Date();
  //   const updatedAt = new Date();

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
