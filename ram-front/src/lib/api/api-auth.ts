// (c) Delta Software 2023, rights reserved.

import { atom, selectorFamily } from "recoil";
import { isTest$ } from "./api-base";
import { createContext, useContext } from "react";

const IS_MOCK = true;

export interface AuthenticationState {
  auth: null | {
    accessToken: string;
  };
}

export interface AuthenticationParams {
  username: string;
  password: string;
}

export interface AuthenticationApi {
  state: AuthenticationState;
  isAuthenticated: boolean;
  authenticate: (params: AuthenticationParams) => void;
  logout: () => void;
}

export const authenticationState$ = atom<AuthenticationState>({
  key: "authenticationState",
  default: {
    auth: null,
  },
});

export const authenticationApi$ = selectorFamily<
  AuthenticationApi,
  { hash: string }
>({
  key: "authenticationApi",
  get:
    ({ hash }) =>
    ({ get, getCallback }): AuthenticationApi => {
      const state = get(authenticationState$);
      const isAuthenticated = !!state.auth;
      const isTest = get(isTest$);

      const authenticate = getCallback(
        ({ set }) =>
          ({ username, password }: AuthenticationParams) => {
            if (isTest || IS_MOCK) {
              set(authenticationState$, {
                auth: {
                  accessToken: `${username}:${password}`,
                },
              });
            }
          },
      );

      const logout = getCallback(({ set }) => () => {
        set(authenticationState$, {
          auth: null,
        });
      });

      return {
        state,
        isAuthenticated,
        authenticate,
        logout,
      };
    },
});

export const AuthenticationContext = createContext({} as AuthenticationApi);

export const useAuthentication = () => {
  return useContext(AuthenticationContext);
};
