// (c) Delta Software 2023, rights reserved.

import { selector } from "recoil";
import { apiBase$, isTest$ } from "./api-base";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  mobile: number;
  phone: number;
  imageUrl?: string;
}

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
        // {
        //   id: "test-course",
        //   name: "Test Course",
        //   groupUsers: [],
        // },
        // {
        //   id: "test-course2",
        //   name: "Test Course 2",
        //   groupUsers: [],
        // },
      ];
    }

    return fetch(`${apiBase}/assurance-types/all`).then((res) => res.json());
  },
});
