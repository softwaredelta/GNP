// (c) Delta Software 2023, rights reserved.

import { atomFamily, selector } from "recoil";
import { apiBase$ } from "./api-base";

export const updateInfraStatus$ = atomFamily({
  key: "infra-status-update",
  default: 0,
});

function makeStatusCheck(key: string, endpoint: string) {
  return selector({
    key,
    get: async ({ get }) => {
      const apiBase = get(apiBase$);
      get(updateInfraStatus$(key));

      const response = await fetch(`${apiBase}/${endpoint}`).catch(() => {
        return { ok: false };
      });
      return response.ok;
    },
  });
}

export const backendStatus$ = makeStatusCheck("backend", "infra/health");
export const dbStatus$ = makeStatusCheck("db", "infra/db");
export const s3Status$ = makeStatusCheck("s3", "infra/s3");
