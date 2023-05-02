// (c) Delta Software 2023, rights reserved.

import { atom, selector, useSetRecoilState } from "recoil";
import { apiBase$, isTest$ } from "./api-base";
import useAxios from "../../hooks/useAxios";
import { ISell } from "../../types";
import { authentication$ } from "./api-auth";

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
  const setUpdateVerifiedSales = useSetRecoilState(updateVerifiedSales$);
  return () => setUpdateVerifiedSales((n) => n + 1);
};

export const allSales$ = selector<ISell[]>({
  key: "allSales$",
  get: async ({ get }): Promise<ISell[]> => {
    get(updateSales$);
    const auth = get(authentication$);
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${auth?.accessToken}`);
    const isTest = get(isTest$);
    const apiBase = get(apiBase$);

    if (isTest) {
      return [
        {
          id: "test-sale-1",
          amountInCents: "100",
          assuranceType: {
            id: "test-assurance-type-1",
            name: "Test assurance type 1",
            description: "Test assurance type 1 description",
          },
          clientName: "Test client name 1",
          evidenceUrl: "https://www.google.com",
          periodicity: "mensual",
          policyNumber: "1234567",
          sellDate: new Date(),
          status: "pending",
        },
        {
          id: "test-sale-2",
          amountInCents: "200",
          assuranceType: {
            id: "test-assurance-type-2",
            name: "Test assurance type 2",
            description: "Test assurance type 2 description",
          },
          clientName: "Test client name 2",
          evidenceUrl: "https://www.google.com",
          periodicity: "mensual",
          policyNumber: "1234568",
          sellDate: new Date(),
          status: "pending",
        },
      ];
    }

    const response = await fetch(`${apiBase}/sales/my-sales`, {
      headers,
    });
    return response.json();
  },
});

export const verifySales$ = selector<ISell[]>({
  key: "verifySales$",
  get: async ({ get }) => {
    get(updateVerifiedSales$);
    const auth = get(authentication$);
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${auth?.accessToken}`);
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
