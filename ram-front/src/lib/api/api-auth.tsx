// (c) Delta Software 2023, rights reserved.

import {
  atom,
  selectorFamily,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { apiBase$, isTest$ } from "./api-base";
import { createContext, useContext, useEffect, useState } from "react";

export const LOCAL_STORAGE_REFRESK_TOKEN_KEY = "refreshToken";
const DISABLE_FETCH = true; // set to true when backend is ready
const AUTHENTICATE_ENDPOINT = "auth/authenticate";
const REFRESH_ENDPOINT = "auth/refresh";

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
      const isAuthenticated = auth !== null;
      const hasError = authError !== null;
      const apiBase = get(apiBase$);
      const isTest = get(isTest$);

      const authenticate = getCallback(
        ({ set }) =>
          ({ username, password }: AuthenticationParams) => {
            if (isTest || DISABLE_FETCH) {
              if (username !== password) {
                set(authenticationError$, {
                  message: "Invalid username or password",
                });
                return;
              }

              set(authentication$, {
                accessToken: "accessToken",
                accessTokenExpiresAt: new Date().getTime() + 60 * 1000,
                refreshToken: "refreshToken",
                refreshTokenExpiresAt:
                  new Date().getTime() + 24 * 60 * 60 * 1000,
                username: "username",
                userRole: "userRole",
              });
              set(authenticationError$, null);

              return;
            }

            (async () => {
              const response = await fetch(
                `${apiBase}/${AUTHENTICATE_ENDPOINT}`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    username,
                    password,
                  }),
                },
              );
              const result = await response.json();
              if (response.ok) {
                set(authentication$, result);
                set(authenticationError$, null);
              } else {
                set(authentication$, null);
                set(authenticationError$, result);
              }
            })();
          },
      );

      const refresh = getCallback(({ set }) => () => {
        if (!isAuthenticated) {
          console.error("Cannot refresh token when not authenticated");
          return;
        }

        const { refreshToken, refreshTokenExpiresAt } = auth;

        console.log("refreshing token", refreshToken, refreshTokenExpiresAt);

        if (isTest || DISABLE_FETCH) {
          if (refreshToken !== "refreshToken") {
            set(authentication$, null);
            set(authenticationError$, null);
          } else {
            set(authentication$, {
              ...auth,
              accessToken: "refreshedAccessToken",
              accessTokenExpiresAt: new Date().getTime() + 60 * 1000,
            });
          }

          return;
        }

        (async () => {
          if (refreshTokenExpiresAt < Date.now()) {
            console.error("Cannot refresh token when expired");

            set(authentication$, null);
            set(authenticationError$, null);
            return;
          }

          const response = await fetch(`${apiBase}/${REFRESH_ENDPOINT}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              refreshToken,
            }),
          });
          const result = await response.json();
          if (response.ok) {
            set(authentication$, result);
            set(authenticationError$, null);
          } else {
            set(authentication$, null);
            set(authenticationError$, result);
          }
        })();
      });

      const logout = getCallback(({ set }) => () => {
        set(authentication$, null);
        set(authenticationError$, null);
        localStorage.removeItem(LOCAL_STORAGE_REFRESK_TOKEN_KEY);
      });

      return {
        auth,
        authError,
        isAuthenticated,
        hasError,
        authenticate,
        logout,
        refresh,
      };
    },
});

export function AuthenticationHanler() {
  const isTest = useRecoilValue(isTest$);
  const [authentication, setAuthentication] = useRecoilState(authentication$);
  const setAuthenticationError = useSetRecoilState(authenticationError$);
  const [isInitialized, setIsInitialized] = useState(false);
  const { refresh } = useAuthentication();

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
          setAuthentication(null);
          localStorage.removeItem(LOCAL_STORAGE_REFRESK_TOKEN_KEY);
        }

        return;
      }
      throw new Error("Not implemented");
    })();

    setIsInitialized(true);
  }, [isInitialized, isTest, setAuthentication, setAuthenticationError]);

  useEffect(() => {
    if (!authentication) return;

    const { accessTokenExpiresAt } = authentication;
    if (accessTokenExpiresAt < Date.now()) return;
    const timeForRefresh = accessTokenExpiresAt - Date.now();
    if (timeForRefresh <= 0) {
      refresh();
      return;
    }

    const timeout = setTimeout(() => {
      refresh();
    }, timeForRefresh);

    return () => {
      clearTimeout(timeout);
    };
  }, [authentication, , refresh]);

  return <></>;
}
