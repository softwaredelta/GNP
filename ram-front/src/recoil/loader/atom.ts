// (c) Delta Software 2023, rights reserved.

import { atom } from "recoil";

export const loading$ = atom<boolean>({
  key: "loading",
  default: false,
});
