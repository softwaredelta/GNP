// (c) Delta Software 2023, rights reserved.

import { getDataSource } from "../arch/db-client";
import { INSTANCE_ID } from "../arch/instance";
import { LogEnt } from "../entities/log.entity";

/**
 * 
 * This logs are accessible via the infra/log endpoint for admin users
 */
export async function log(kind: string, data: string | object) {
  const ds = await getDataSource();
  await ds.manager.save(
    LogEnt,
    ds.manager.create(LogEnt, {
      instanceId: INSTANCE_ID,
      kind,
      message: typeof data === "string" ? data : JSON.stringify(data),
    }),
  );
}
