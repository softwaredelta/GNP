// (c) Delta Software 2023, rights reserved.

import {
  atom,
  selectorFamily,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { apiBase$, isTest$ } from "./api-base";
import { useEffect, useState } from "react";
import { useHash } from "./api-hash";

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
  roles: string[];
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
  isLoading: boolean;
  isAuthenticated: boolean;
  hasError: boolean;
  clearError: () => void;
  authenticate: (params: AuthenticationParams) => void;
  logout: () => void;
  refresh: () => void;
}

// implementation

export const authentication$ = atom<Authentication | null>({
  key: "authentication",
  default: null,
});

const authenticationError$ = atom<AuthenticationError | null>({
  key: "authenticationError",
  default: null,
});

const isLoading$ = atom<boolean>({
  key: "isLoading",
  default: false,
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

const authenticationApi$ = selectorFamily<AuthenticationApi, { hash: string }>({
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
      const isLoading = get(isLoading$);

      console.log("authentication", auth);

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
                roles: ["regular"],
              });
              set(authenticationError$, null);

              return;
            }

            (async () => {
              set(isLoading$, true);
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
              set(isLoading$, false);
              if (response.ok) {
                console.log("authentication result", result);
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
                console.log("authentication error", result);
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

        set(isLoading$, true);
        refreshTokens({
          apiBase,
          refreshToken,
          refreshTokenExpiresAt,
          setAuthentication: (a) => set(authentication$, a),
          setAuthenticationError: (a) => set(authenticationError$, a),
        });
        set(isLoading$, false);
      });

      const logout = getCallback(({ set }) => () => {
        set(authentication$, null);
        set(authenticationError$, null);
        localStorage.removeItem(LOCAL_STORAGE_REFRESK_TOKEN_KEY);
      });

      const clearError = getCallback(({ set }) => () => {
        set(authenticationError$, null);
      });

      return {
        auth,
        authError,
        isAuthenticated,
        isLoading,
        hasError,
        clearError,
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
  const hash = useHash();
  const { refresh } = useRecoilValue(authenticationApi$({ hash }));
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
            roles: ["regular"],
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

export const useAuthentication = () => {
  const hash = useHash();
  const authenticationApi = useRecoilValue(authenticationApi$({ hash }));
  return authenticationApi;
};
