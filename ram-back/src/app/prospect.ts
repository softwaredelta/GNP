// (c) Delta Software 2023, rights reserved.

import { getDataSource } from "../arch/db-client";
import { ProspectEnt } from "../entities/prospect.entity";
import { StatusEnt, StatusNames } from "../entities/status.entity";
import { ProspectStatusEnt } from "../entities/prospect-status.entity";

export enum ProspectError {
  PROSPECT_ERROR = "DEFAULT_ERROR",
}

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
      order: { prospectStatus: { updatedStatusDate: "DESC" }},
    });

    return { prospects: prospects.map((p) => ({...p, prospectStatus: [p.prospectStatus[0]]})) };
  } catch (e) {
    return {
      error: ProspectError.PROSPECT_ERROR,
      reason: e as Error,
      prospects: [],
    };
  }
}
