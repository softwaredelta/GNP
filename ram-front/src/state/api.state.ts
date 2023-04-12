// (c) Delta Software 2023, rights reserved.

import { atom, selector, selectorFamily } from "recoil";

// Example of an atom, this one holds the configuration string for
// api base URL
export const baseUrlAtom = atom({
  key: "api.baseUrl",
  default: import.meta.env.VITE_API_URL,
});

// Example of a selector family, this one generates the endpoint URL
// for a given endpoint name
export const endpointSelectorFamily = selectorFamily({
  key: "api.endpoint",
  get:
    (endpoint: string) =>
    ({ get }) =>
      `${get(baseUrlAtom)}/${endpoint}`,
});

// Example of an async selector, this one fetches the current time from
// the database, simulates load time
export const databaseTimeSelector = selector({
  key: "api.databaseTime",
  get: async ({ get }) => {
    const endpoint = get(endpointSelectorFamily("time"));
    console.info(`Fetching time from ${endpoint}`);
    const { now } = await fetch(endpoint).then((res) => res.json());
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return now;
  },
});
