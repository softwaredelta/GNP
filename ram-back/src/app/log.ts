// (c) Delta Software 2023, rights reserved.

import { getDataSource } from "../arch/db-client";
import { INSTANCE_ID } from "../arch/instance";
import { LogEnt } from "../entities/log.entity";

/**
 * This TypeScript function logs data to a database using an instance ID, kind, and message.
 * @param {string} kind - The `kind` parameter is a string that represents the type or category of the
 * log message being recorded. It could be something like "error", "info", "debug", "warning", etc.
 * @param {string | object} data - The `data` parameter is either a string or an object. It represents
 * the information that needs to be logged. If it is a string, it will be saved as is. If it is an
 * object, it will be converted to a JSON string before being saved.
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
