// (c) Delta Software 2023, rights reserved.

import { atom, selector } from "recoil";

export const isTest$ = atom({
  key: "isTestAtom",
  default: process.env.NODE_ENV === "test",
});

export const apiBase$ = selector({
  key: "apiBaseSelector",
  get: ({ get }) => {
    const isTest = get(isTest$);
    return isTest ? "http://test.dev" : import.meta.env.VITE_API_URL;
  },
});
