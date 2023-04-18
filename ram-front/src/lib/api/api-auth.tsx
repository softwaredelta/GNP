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
const DISABLE_FETCH = false; // set to true when backend is ready, set to false if you want mocked data
const AUTHENTICATE_ENDPOINT = "user/authenticate";
const REFRESH_ENDPOINT = "user/refresh";

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

async function refreshTokens({
  refreshToken,
  refreshTokenExpiresAt,
  setAuthentication,
  setAuthenticationError,
  apiBase,
}: {
  refreshToken: string;
  refreshTokenExpiresAt: number;
  setAuthentication: (auth: Authentication | null) => void;
  setAuthenticationError: (authError: AuthenticationError | null) => void;
  apiBase: string;
}) {
  const response = await fetch(`${apiBase}/${REFRESH_ENDPOINT}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refreshToken,
      refreshTokenExpiresAt,
    }),
  });
  const result = await response.json();
  if (response.ok) {
    setAuthentication(result);
    setAuthenticationError(null);
  } else {
    setAuthentication(null);
    setAuthenticationError(result);
  }
}

export const authenticationApi$ = selectorFamily<
  AuthenticationApi,
  { hash: string }
>({
  key: "authenticationApi",
  get:
    () =>
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
                    email: username,
                    password,
                  }),
                },
              );
              const result = await response.json();
              if (response.ok) {
                set(authentication$, result);
                set(authenticationError$, null);

                localStorage.setItem(
                  LOCAL_STORAGE_REFRESK_TOKEN_KEY,
                  JSON.stringify({
                    refreshToken: result.refreshToken,
                    refreshTokenExpiresAt: result.refreshTokenExpiresAt,
                  }),
                );
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

        refreshTokens({
          apiBase,
          refreshToken,
          refreshTokenExpiresAt,
          setAuthentication: (a) => set(authentication$, a),
          setAuthenticationError: (a) => set(authenticationError$, a),
        });
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

export function AuthenticationHandler() {
  const isTest = useRecoilValue(isTest$);
  const [authentication, setAuthentication] = useRecoilState(authentication$);
  const setAuthenticationError = useSetRecoilState(authenticationError$);
  const [isInitialized, setIsInitialized] = useState(false);
  const { refresh } = useAuthentication();
  const apiBase = useRecoilValue(apiBase$);

  useEffect(() => {
    if (isInitialized) return;
    setIsInitialized(true);

    (async () => {
      const storedToken = localStorage.getItem(LOCAL_STORAGE_REFRESK_TOKEN_KEY);
      if (!storedToken) {
        return;
      }
      const { refreshToken, refreshTokenExpiresAt } = JSON.parse(storedToken);

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

      refreshTokens({
        refreshToken,
        refreshTokenExpiresAt,
        apiBase,
        setAuthentication,
        setAuthenticationError,
      });
    })();
  }, [
    apiBase,
    isInitialized,
    isTest,
    setAuthentication,
    setAuthenticationError,
  ]);

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
  }, [authentication, refresh]);

  return <></>;
}