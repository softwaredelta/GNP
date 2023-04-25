// (c) Delta Software 2023, rights reserved.

import { atom, selector, useSetRecoilState } from "recoil";
import { apiBase$, isTest$ } from "./api-base";
// import { DeepPartial } from "ts-essentials";
// import { AssuranceTypeEnt } from "../../../ram-back/src/entities/assurance-type.entity.ts";
// import { UserEnt } from "../../../ram-back/src/entities/user.entity.ts";

export interface AssuranceType {
  id: string;
  name: string;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}
export interface Sell {
  id: string;
  policyNumber: string;
  assuranceType: AssuranceType;
  sellDate: Date;
  amountInCents: string;
  clientName: string;
  status: string;
  periodicity: string;
  user: User;
  evidenceUrl: string;
}

const updateSales$ = atom<number>({
  key: "updateSales",
  default: 0,
});

export const useUpdateSales = () => {
  const setUpdateSales = useSetRecoilState(updateSales$);
  return () => setUpdateSales((n) => n + 1);
};

export const allSales$ = selector<Sell[]>({
  key: "allSales$",
  get: async ({ get }) => {
    get(updateSales$);
    const isTest = get(isTest$);
    const apiBase = get(apiBase$);

    if (isTest) {
      return [
        {
          id: "test-id",
          clientname: "Test name",
        },
      ];
    }

    return fetch(`${apiBase}/sales/all`).then((res) => res.json());
  },
});
