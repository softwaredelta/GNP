// (c) Delta Software 2023, rights reserved.

import { atom, selector, useSetRecoilState } from "recoil";
import { apiBase$, isTest$ } from "./api-base";
import useAxios from "../../hooks/useAxios";
import { authentication$ } from "./api-auth";
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

const updateVerifiedSales$ = atom<number>({
  key: "updateVerifiedSales",
  default: 0,
});

export const useUpdateSales = () => {
  const setUpdateSales = useSetRecoilState(updateSales$);
  return () => setUpdateSales((n) => n + 1);
};

export const useUpdateVerifiedSales = () => {
  const setUpdateSales = useSetRecoilState(updateVerifiedSales$);
  return () => setUpdateSales((n) => n + 1);
};

export const allSales$ = selector<Sell[]>({
  key: "allSales$",
  get: async ({ get }) => {
    get(updateSales$);
    const auth = get(authentication$);
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${auth.accessToken}`);
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

    const response = await fetch(`${apiBase}/sales/my-sales`, {
      headers,
    });
    return response.json();
  },
});

export const verifySales$ = selector<Sell[]>({
  key: "verifySales$",
  get: async ({ get }) => {
    get(updateVerifiedSales$);
    const auth = get(authentication$);
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${auth.accessToken}`);
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

    const response = await fetch(`${apiBase}/sales/verify-sales`, {
      headers,
    });
    return response.json();
  },
});

export type SaleData = {
  policyNumber: string;
  sellDate: Date | null;
  assuranceType: {
    id: string;
  };
  amountInCents: string;
  clientName: string;
  periodicity: string;
};

type CreateSaleResponse = {
  data: {
    group: {
      id: string;
      name: string;
    };
  };
};

type UseCreateSaleProps = {
  saleData: SaleData;
};

export function CreateNewSale({ saleData }: UseCreateSaleProps) {
  const { response, error, callback } = useAxios<CreateSaleResponse>({
    url: "sales/create",
    method: "POST",
    body: saleData,
  });

  return { response, error, callback };
}
