// (c) Delta Software 2023, rights reserved.

import { getDataSource } from "../arch/db-client";
import { AssuranceTypeEnt } from "../entities/assurance-type.entity";
import { v4 } from "uuid";

export enum AssuranceTypeError {
  ASSURANCE_TYPE_ERROR = "DEFAULT_ERROR",
}

/**
 * This function creates an assurance type with a given name, description, and ID, and returns a
 * Promise containing the created assurance type or an error.
 * @param params - The `createAssuranceType` function takes in an object `params` with the following
 * properties: name of type string, description(Optional) of type string, id(Optional) of type string.
 * @returns a Promise that resolves to an object with two properties: `assuranceType` and `error`. The
 * `assuranceType` property is an instance of the `AssuranceTypeEnt` class, which is created by saving
 * the `name`, `description`, and `id` (if provided) parameters to a data source using the `save`
 * method of the data source's
 */
export async function createAssuranceType(params: {
  name: string;
  description?: string;
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
