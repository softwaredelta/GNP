// (c) Delta Software 2023, rights reserved.

import { atom, selector } from "recoil";
import { apiBase$ } from "./api-base";

const update = atom({
  key: "apiHealthUpdate",
  default: 0,
});

export interface ApiHealth {
  health: string;
  update: () => void;
}

export const apiHealth$ = selector<ApiHealth>({
  key: "apiHealthSelector",
  get: async ({ get, getCallback }) => {
    const apiBase = get(apiBase$);
    const health = await fetch(`${apiBase}/health`).then((res) => res.text());
    return {
      health,
      update: getCallback(({ set }) => () => {
        set(update, (v) => v + 1);
      }),
    };
  },
});
