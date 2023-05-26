// (c) Delta Software 2023, rights reserved.

import { atom, selector, useSetRecoilState } from "recoil";
import { apiBase$, isTest$ } from "./api-base";
import { accessToken$ } from "./api-auth";
import { IGroup } from "../../types";

const updateGroups$ = atom<number>({
  key: "updateGroups",
  default: 0,
});

export const useUpdateGroups = () => {
  const setUpdateGroups = useSetRecoilState(updateGroups$);
  return () => setUpdateGroups((n) => n + 1);
};

export const allCourses$ = selector<IGroup[]>({
  key: "allCourses$",
  get: async ({ get }): Promise<IGroup[]> => {
    get(updateGroups$);
    const isTest = get(isTest$);
    const apiBase = get(apiBase$);
    const accessToken = get(accessToken$);

    if (isTest) {
      return [
        {
          id: "test-course",
          name: "Test Course",
          description: "This is a test course",
          imageUrl: "https://picsum.photos/200",
          groupUsers: [],
          deliveries: [],
          userDeliveries: [],
          progress: 0,
        },
        {
          id: "test-course2",
          name: "Test Course 2",
          description: "This is a test course 2",
          imageUrl: "https://picsum.photos/200",
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
