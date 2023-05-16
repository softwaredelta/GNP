// (c) Delta Software 2023, rights reserved.

import { selectorFamily } from "recoil";
import { apiBase$, isTest$ } from "./api-base";
import { authentication$ } from "./api-auth";
import axios from "axios";
import { DeliveryStatus, IUser } from "../../types";

export interface IDelivery {
  id: string;
  description: string;
  imageUrl: string;
  userDeliveries: IUserDelivery[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDelivery {
  id: string;
  user: IUser;
  userId: string;
  delivery: IDelivery;
  deliveryId: string;
  dateDelivery: Date;
  status: DeliveryStatus;
  fileUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export const allUserDeliveries$ = selectorFamily<
  IUserDelivery[],
  { id: string }
>({
  key: "allUserDeliveries$",
  get:
    ({ id }) =>
    async ({ get }): Promise<IUserDelivery[]> => {
      const isTest: boolean = get(isTest$);
      const apiBase = get(apiBase$);

      if (isTest) {
        return [
          {
            id: "test-user-delivery",
            user: {
              id: "test-user",
              email: "test@delta.tec.mx",
              imageURL: "https://picsum.photos/200",
              lastName: "Test",
              name: "Test",
            },
            userId: "test-user",
            deliveryId: "test-delivery",
            delivery: {
              id: "test-delivery",
              description: "Test delivery description",
              imageUrl: "https://google.com",
              userDeliveries: [],
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            status: "Sin enviar",
            dateDelivery: new Date(),
            fileUrl: "https://google.com",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];
      }
      return fetch(`${apiBase}/user-delivery/${id}`).then((res) => res.json());
    },
});

export const authenticatedUserDelivery$ = selectorFamily<
  IUserDelivery | null,
  { deliveryID: string }
>({
  key: "authenticatedUserDelivery$",
  get:
    ({ deliveryID }) =>
    async ({ get }): Promise<IUserDelivery | null> => {
      const isTest: boolean = get(isTest$);
      const auth = get(authentication$);
      const isAuthenticated: boolean = auth !== null;
      const apiBase = get(apiBase$);

      if (isTest && isAuthenticated) {
        return {
          id: "test-user-delivery",
          user: {
            id: "test-user",
            email: "test@delta.tec.mx",
            imageURL: "https://picsum.photos/200",
            lastName: "Test",
            name: "Test",
          },
          userId: "test-user",
          deliveryId: "test-delivery",
          delivery: {
            id: "test-delivery",
            description: "Test delivery description",
            imageUrl: "https://google.com",
            userDeliveries: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          dateDelivery: new Date(),
          fileUrl: "https://google.com",
          status: "Sin enviar",
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }

      const response = await axios.get(
        `${apiBase}/user-delivery/${deliveryID}/auth`,
        {
          headers: {
            Authorization: `Bearer ${auth?.accessToken}`,
          },
        },
      );
      if (response.data.error) {
        return null;
      } else {
        return response.data;
      }
    },
});
