// (c) Delta Software 2023, rights reserved.

import { atom } from "recoil";
import { IAlert } from ".";

export const alert = atom<IAlert>({
  key: "alert",
  default: {
    isOpen: false,
    type: "success",
    message: "",
    description: "",
  },
});
