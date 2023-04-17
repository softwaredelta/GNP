// (c) Delta Software 2023, rights reserved.

import {
  atom,
  selectorFamily,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { apiBase$, isTest$ } from "./api-base";
import { createContext, useContext, useEffect, useState } from "react";

export const LOCAL_STORAGE_REFRESK_TOKEN_KEY = "refreshToken";

export interface Authentication {
  accessToken: string;
  accessTokenExpiresAt: number;
  refreshToken: string;
  refreshTokenExpiresAt: number;
  username: string;
  userRole: string;
}

export interface AuthenticationError {
  message: string;
}

export interface AuthenticationParams {
  username: string;
  password: string;
}

export interface AuthenticationApi {
  auth: Authentication | null;
  authError: AuthenticationError | null;
  isAuthenticated: boolean;
  hasError: boolean;
  authenticate: (params: AuthenticationParams) => void;
  logout: () => void;
  refresh: () => void;
}

export const AuthenticationContext = createContext({} as AuthenticationApi);

export const useAuthentication = () => {
  return useContext(AuthenticationContext);
};

// implementation

const authentication$ = atom<Authentication | null>({
  key: "authentication",
  default: null,
});

const authenticationError$ = atom<AuthenticationError | null>({
  key: "authenticationError",
  default: null,
});

export const authenticationApi$ = selectorFamily<
  AuthenticationApi,
  { hash: string }
>({
  key: "authenticationApi",
  get:
    ({ hash }) =>
    ({ get, getCallback }): AuthenticationApi => {
      const auth = get(authentication$);
      const authError = get(authenticationError$);
      const apiBase = get(apiBase$);
      const isTest = get(isTest$);

      const authenticate = getCallback(
        ({ set }) =>
          ({ username, password }: AuthenticationParams) => {
            if (isTest) {
              if (username !== password) {
                set(authenticationError$, {
                  message: "Invalid username or password",
                });
                return;
              }

              set(authentication$, {
                accessToken: "accessToken",
                accessTokenExpiresAt: 0,
                refreshToken: "refreshToken",
                refreshTokenExpiresAt: 0,
                username: "username",
                userRole: "userRole",
              });
              set(authenticationError$, null);

              return;
            }

            throw new Error("Not implemented");
          },
      );

      const logout = getCallback(({ set }) => () => {
        set(authentication$, null);
        set(authenticationError$, null);
      });

      return {
        auth,
        authError,
        isAuthenticated: auth !== null,
        hasError: authError !== null,
        authenticate,
        logout,
        refresh: () => {},
      };
    },
});

export function AuthenticationHanler() {
  const isTest = useRecoilValue(isTest$);
  const setAuthentication = useSetRecoilState(authentication$);
  const setAuthenticationError = useSetRecoilState(authenticationError$);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isInitialized) return;

    (async () => {
      const refreshToken = localStorage.getItem(
        LOCAL_STORAGE_REFRESK_TOKEN_KEY,
      );
      if (!refreshToken) return;

      if (isTest) {
        if (refreshToken === "valid-refresh-token") {
          setAuthentication({
            accessToken: "accessToken",
            accessTokenExpiresAt: 3600,
            refreshToken: "refreshToken",
            refreshTokenExpiresAt: 3600,
            username: "username",
            userRole: "userRole",
          });
        } else {
          setAuthenticationError({
            message: "Invalid refresh token",
          });
        }

        return;
      }
      throw new Error("Not implemented");
    })();

    setIsInitialized(true);
  }, [isInitialized, isTest, setAuthentication, setAuthenticationError]);

  return <></>;
}
