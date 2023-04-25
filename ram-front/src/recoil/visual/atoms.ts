// (c) Delta Software 2023, rights reserved.

import { atom } from "recoil";
import { IAlert } from ".";

export const alerts$ = atom<Array<IAlert>>({
  key: "alert",
  default: [],
});
