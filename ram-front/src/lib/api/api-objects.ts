// (c) Delta Software 2023, rights reserved.

import { atom, selector } from "recoil";
import { apiBase$ } from "./api-base";

const update = atom({
  key: "apiObjectsUpdate",
  default: 0,
});

export interface ApiObjects {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  objects: any;
  update: () => void;
}

export const apiObjects$ = selector<ApiObjects>({
  key: "apiObjectsSelector",
  get: async ({ get, getCallback }) => {
    const apiBase = get(apiBase$);
    const objects = await fetch(`${apiBase}/objects`).then((res) => res.json());
    return {
      objects,
      update: getCallback(({ set }) => () => {
        set(update, (v) => v + 1);
      }),
    };
  },
});
