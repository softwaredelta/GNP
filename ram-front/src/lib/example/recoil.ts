// (c) Delta Software 2023, rights reserved.

import { atom, selector } from "recoil";

export const foo$ = atom({
  key: "fooAtom",
  default: 0,
});

export const bar$ = selector({
  key: "barSelector",
  get: async ({ get, getCallback }) => {
    const foo = get(foo$);
    return {
      multiplied: foo * 100,
      update: getCallback(({ set }) => (cb: (prev: number) => number) => {
        set(foo$, cb);
      }),
    };
  },
});
