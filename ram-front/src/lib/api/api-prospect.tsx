import { atom, selector, useSetRecoilState } from "recoil";
import { apiBase$, isTest$ } from "./api-base";
import useAxios from "../../hooks/useAxios";
import { IUser } from "../../types";
import { authentication$ } from "./api-auth";


const updateSales$ = atom<number>({
    key: "updateSales",
    default: 0,
  });

export const allSales$ = selector<IUser[]>({
    key: "allSales$",
    get: async ({ get }): Promise<IUser[]> => {
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
            email: "test-email@test.com",
            imageURL: "sjfskjdfhsdsjhalkd",
          },
          {
            id: "test-sale-2",
            email: "test-email@test.com",
            imageURL: "sjfskjdfhsdsjhalkd",
          },
        ];
      }
  
      const response = await fetch(`${apiBase}/user/all`, {
        headers,
      });
      return response.json();
    },
  });