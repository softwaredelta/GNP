// (c) Delta Software 2023, rights reserved.

import { atom, selector } from "recoil";
import { apiBase$, isTest$ } from "./api-base";

const update = atom({
  key: "apiTimeUpdate",
  default: 0,
});

export interface ApiTime {
  now: string;
  update: () => void;
}

export const apiTime$ = selector<ApiTime>({
  key: "apiTimeSelector",
  get: async ({ get, getCallback }) => {
    const apiBase = get(apiBase$);
    const isTest = get(isTest$);
    get(update);

    const updateTime = getCallback(({ set }) => () => {
      set(update, (v) => v + 1);
    });

    if (isTest) {
      return {
        now: new Date().toISOString(),
        update: updateTime,
      };
    }

    const { now } = (await fetch(`${apiBase}/time`).then(
      (r) => r.json(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    )) as any;

    return {
      now,
      update: updateTime,
    };
  },
});
