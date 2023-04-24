// (c) Delta Software 2023, rights reserved.

import { selector } from "recoil";
import { apiBase$, isTest$ } from "./api-base";
export interface AssuranceType {
  id: string;
  name: string;
  description: string;
}

export const allAssuranceTypes$ = selector<AssuranceType[]>({
  key: "allAssuranceTypes$",
  get: async ({ get }) => {
    const isTest = get(isTest$);
    const apiBase = get(apiBase$);

    if (isTest) {
      return [
        {
          id: "test-id",
          name: "Test name",
          description: "test-description",
        },
      ];
    }

    return fetch(`${apiBase}/assurance-types/all`).then((res) => res.json());
  },
});
