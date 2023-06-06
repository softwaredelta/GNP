// (c) Delta Software 2023, rights reserved.

import { getDataSource } from "../arch/db-client";
import { ProspectStatusEnt } from "../entities/prospect-status.entity";
import { ProspectEnt } from "../entities/prospect.entity";
import { StatusEnt, StatusNames } from "../entities/status.entity";

export enum ProspectError {
  PROSPECT_ERROR = "DEFAULT_ERROR",
}

/**
 * This function creates a new prospect with optional status and commentary fields and returns the
 * prospect entity or an error if it fails.
 * @param params - The function `createProspect` takes in an object `params` with the following
 * properties: name of type string, firtSurname of type string, secondSurname of type string,
 * comentary of type string, statusId of type string, userId of type string.
 * @returns a Promise that resolves to an object with the created prospect entity and an optional error
 * or reason if the creation process fails. The object has the following structure: `{ prospect:
 * ProspectEnt; error?: ProspectError; reason?: Error }`.
 * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=1119997643
 * M5_S03
 */
export async function createProspect(params: {
  name: string;
  firstSurname: string;
  secondSurname: string;
  comentary?: string;
  statusId?: string;
  userId: string;
}): Promise<{ prospect: ProspectEnt; error?: ProspectError; reason?: Error }> {
  const ds = await getDataSource();

  const { name, firstSurname, secondSurname, userId, comentary, statusId } =
    params;

  try {
    return await ds.manager.transaction(async (manager) => {
      const prospect = await manager.save(
        manager.create(ProspectEnt, {
          name,
          firstSurname,
          secondSurname,
          userId,
        }),
      );

      if (statusId) {
        await manager.save(
          manager.create(ProspectStatusEnt, {
            prospectId: prospect.id,
            statusId,
            statusComment: comentary,
          }),
        );
        const prospectRelations = await manager.findOne(ProspectEnt, {
          where: { id: prospect.id },
          relations: { prospectStatus: { status: true } },
        });

        return { prospect: prospectRelations as ProspectEnt };
      }
      const status = await manager.findOne(StatusEnt, {
        where: { statusName: StatusNames.NEW },
      });
      await manager.save(
        manager.create(ProspectStatusEnt, {
          prospectId: prospect.id,
          statusId: status?.id,
          statusComment: "Nuevo prospecto",
        }),
      );
      const prospectRelations = await manager.findOne(ProspectEnt, {
        where: { id: prospect.id },
        relations: { prospectStatus: { status: true } },
      });

      return { prospect: prospectRelations as ProspectEnt };
    });
  } catch (e) {
    return {
      prospect: {} as ProspectEnt,
      error: ProspectError.PROSPECT_ERROR,
      reason: new Error("No se pudo crear el prospecto"),
    };
  }
}

/**
 * This function retrieves the prospect status for a given user ID from a data source and returns it as
 * an array of ProspectEnt objects, with an optional error or reason for failure.
 * @param params - The function `getProspectStatus` takes in an object `params` with a single property
 * `userId` which is a string representing the ID of the user whose prospect status is being retrieved.
 * @returns a Promise that resolves to an object with the following properties:
 * - prospects: an array of ProspectEnt objects with their corresponding ProspectStatus object (only
 * the first one) included as a relation. The array is mapped to include only the first ProspectStatus
 * object for each ProspectEnt.
 * - error: an optional property that indicates if there was an error while executing the function.
 * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=1001315964
 * M5_S01
 */
export async function getProspectStatus(params: { userId: string }): Promise<{
  prospects: ProspectEnt[];
  error?: ProspectError;
  reason?: Error;
}> {
  const ds = await getDataSource();

  try {
    const prospects = await ds.manager.find(ProspectEnt, {
      relations: {
        prospectStatus: {
          status: true,
        },
      },
      where: { userId: params.userId },
      order: { prospectStatus: { updatedStatusDate: "DESC" } },
    });

    return {
      prospects: prospects.map((p) => ({
        ...p,
        prospectStatus: [p.prospectStatus[0]],
      })),
    };
  } catch (e) {
    return {
      error: ProspectError.PROSPECT_ERROR,
      reason: e as Error,
      prospects: [],
    };
  }
}

/**
 * This function retrieves a list of prospects for a given agent ID, including their prospect status,
 * from a data source and returns it as a Promise.
 * @param params - The function `getProspectsByAgent` takes in an object `params` as its parameter.
 * This object has one property `agentId` which is a string representing the ID of the agent whose
 * prospects are to be retrieved.
 * @returns a Promise that resolves to an object with the following properties:
 * - prospects: an array of ProspectEnt objects that match the given agentId, with their prospectStatus
 * property filtered to only include the most recent status update.
 * - error: an optional ProspectError enum value if there was an error retrieving the prospects.
 * - reason: an optional Error object that provides more information about the error.
 */
export async function getProspectsByAgent(params: {
  agentId: string;
}): Promise<{
  prospects: ProspectEnt[];
  error?: ProspectError;
  reason?: Error;
}> {
  const ds = await getDataSource();

  try {
    const prospects = await ds.manager.find(ProspectEnt, {
      relations: {
        prospectStatus: {
          status: true,
        },
      },
      where: { userId: params.agentId },
      order: { prospectStatus: { updatedStatusDate: "DESC" } },
    });

    return {
      prospects: prospects.map((p) => ({
        ...p,
        prospectStatus: [p.prospectStatus[0]],
      })),
    };
  } catch (e) {
    return {
      error: ProspectError.PROSPECT_ERROR,
      reason: e as Error,
      prospects: [],
    };
  }
}

/**
 * This function modifies a prospect's status and status comment in a database transaction and returns
 * the updated prospect or an error.
 * @param params - The function `modifyProspect` takes in an object `params` with the following
 * properties: prospectId of type string, statusId of type string, statusComment of type string
 * @returns a Promise that resolves to an object with the following properties:
 * - `prospect`: a `ProspectEnt` object that represents the modified prospect.
 * - `error`: an optional `ProspectError` object that represents an error that occurred during the
 * modification process.
 * - `reason`: an optional `Error` object that represents the reason why the modification process
 * failed.
 */
export async function modifyProspect(params: {
  prospectId: string;
  statusId?: string;
  statusComment: string;
}): Promise<{
  prospect: ProspectEnt;
  error?: ProspectError;
  reason?: Error;
}> {
  const ds = await getDataSource();

  const { prospectId, statusId, statusComment } = params;

  try {
    return await ds.manager.transaction(async (manager) => {
      const prospect = await manager.findOne(ProspectEnt, {
        where: { id: prospectId },
        relations: { prospectStatus: { status: true } },
      });

      if (!prospect) {
        throw new Error("Prospecto no encontrado");
      }

      await manager.save(
        manager.create(ProspectStatusEnt, {
          prospectId: prospect.id,
          statusId,
          statusComment,
        }),
      );

      const prospectRelations = await manager.findOne(ProspectEnt, {
        where: { id: prospect.id },
        relations: { prospectStatus: { status: true } },
      });

      return { prospect: prospectRelations as ProspectEnt };
    });
  } catch (e) {
    return {
      prospect: {} as ProspectEnt,
      error: e as ProspectError,
      reason: new Error("No se pudo modificar el prospecto"),
    };
  }
}
