// (c) Delta Software 2023, rights reserved.

import { selector } from "recoil";
import { apiBase$, isTest$ } from "./api-base";
import { accessToken$ } from "./api-auth";
import { IGroup } from "../../types";

export const allCourses$ = selector<IGroup[]>({
  key: "allCourses$",
  get: async ({ get }): Promise<IGroup[]> => {
    const isTest = get(isTest$);
    const apiBase = get(apiBase$);
    const accessToken = get(accessToken$);

    if (isTest) {
      return [
        {
          id: "test-course",
          name: "Test Course",
          description: "This is a test course",
          imageURL: "https://picsum.photos/200",
          groupUsers: [],
          deliveries: [],
          userDeliveries: [],
          progress: 0,
        },
        {
          id: "test-course2",
          name: "Test Course 2",
          description: "This is a test course 2",
          imageURL: "https://picsum.photos/200",
          groupUsers: [],
          deliveries: [],
          userDeliveries: [],
          progress: 0,
        },
      ];
    }

    return fetch(`${apiBase}/groups/all`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  },
});
