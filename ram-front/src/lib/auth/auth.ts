// (c) Delta Software 2023, rights reserved.

import { atom, selector } from "recoil";

export interface Auth {
  accessToken: string;
  username: string;
}

export const auth$ = atom<Auth | null>({
  key: "authAtom",
  default: null,
});

export const isAuthenticated$ = selector({
  key: "isAuthenticatedSelector",
  get: ({ get }) => {
    const auth = get(auth$);
    return auth !== null;
  },
});

export const authenticate$ = selector({
  key: "authenticateSelector",
  get: ({ getCallback }) => {
    return getCallback(
      ({ set, snapshot }) =>
        async ({ username, password }) => {
          if (await snapshot.getPromise(isAuthenticated$)) {
            throw new Error("Already authenticated, should logout first");
          }

          // TODO:
          // - implement real fetch to backend
          // - implement test mode
          set(auth$, {
            accessToken: `${username}:${password}`,
            username,
          });
        },
    );
  },
});

export const logout$ = selector({
  key: "logoutSelector",
  get: ({ getCallback }) => {
    return getCallback(({ set, snapshot }) => async () => {
      if (!(await snapshot.getPromise(isAuthenticated$))) {
        throw new Error("Not authenticated, should login first");
      }

      // TODO:
      // - implement real fetch to backend
      // - implement test mode
      set(auth$, null);
    });
  },
});
