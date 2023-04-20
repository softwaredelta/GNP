import { selector } from "recoil";
import { alert } from "./atoms";

export const selectAlert = selector({
  key: "selectAlert",
  get: ({ get }) => {
    return get(alert);
  },
});
