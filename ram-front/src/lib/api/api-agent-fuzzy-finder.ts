// (c) Delta Software 2023, rights reserved.

import { atom, selector } from "recoil";
import { IUser } from "../../types";
import { accessToken$ } from "./api-auth";
import { apiBase$ } from "./api-base";

export const fuzzyFinderQuery$ = atom<string>({
  default: "",
  key: "agentFuzzyFinderQuery",
});

export const fuzzyFinderUsers$ = selector<IUser[]>({
  key: "agentFuzzyFinderDataSelector",
  get: async ({ get }): Promise<IUser[]> => {
    const query = encodeURIComponent(get(fuzzyFinderQuery$));
    const token = get(accessToken$);
    const apiBase = get(apiBase$);
    if (!query) {
      return [];
    }

    return fetch(`${apiBase}/user/fuzzy-search?query=${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json());
  },
});
