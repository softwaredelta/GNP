// (c) Delta Software 2023, rights reserved.

import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  fuzzyFinderQuery$,
  fuzzyFinderUsers$,
} from "../../lib/api/api-agent-fuzzy-finder";
import { useCallback, useMemo, useState } from "react";
import { useLoadable } from "../../lib/loadable";
import { IUser } from "../../types";
import { accessToken$ } from "../../lib/api/api-auth";
import { apiBase$ } from "../../lib/api/api-base";

const TIMER_DELAY = 150;

function FuzzyFinderUser({
  selected,
  user,
}: {
  selected: boolean;
  user: IUser;
}) {
  const selectedClass = selected ? "bg-blue-500 border-blue-700 border-1" : "";

  return (
    <div className={`${selectedClass}`}>
      {user.name} {user.lastName}
    </div>
  );
}

export default function AgentFuzzyFinder({
  onReloadAgents,
  groupId,
  groupAgents,
}: {
  onReloadAgents: () => void;
  groupId: string;
  groupAgents: IUser[];
}) {
  const setQuery = useSetRecoilState(fuzzyFinderQuery$);
  const [allUsers /*, state*/] = useLoadable([], fuzzyFinderUsers$);
  const users = useMemo(() => {
    return allUsers.filter((user) => {
      return !groupAgents.some((groupAgent) => groupAgent.id === user.id);
    });
  }, [allUsers, groupAgents]);
  const [timer, setTimer] = useState<null | ReturnType<typeof setTimeout>>(
    null,
  );
  const [selectedItem, setSelectedItem] = useState<null | number>(null);
  const accessToken = useRecoilValue(accessToken$);
  const apiBase = useRecoilValue(apiBase$);

  const updateQuery = useCallback(
    (query: string) => {
      if (timer) {
        clearTimeout(timer);
      }
      const newTimer = setTimeout(() => {
        setQuery(query);
        setTimer(null);
        setSelectedItem(null);
      }, TIMER_DELAY);
      setTimer(newTimer);
    },
    [setQuery, timer],
  );

  const addUser = useCallback(
    async (userId: string) => {
      await fetch(
        `${apiBase}/groups/${groupId}/add-user?userId=${encodeURIComponent(
          userId,
        )}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
    },
    [accessToken, apiBase],
  );

  const handleKeyDown = useCallback(
    (event: any) => {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        // Move the selection up
        const selectedIndex =
          selectedItem !== null ? (selectedItem > 0 ? selectedItem - 1 : 0) : 0;
        setSelectedItem(selectedIndex);
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        // Move the selection down
        const selectedIndex =
          selectedItem !== null
            ? selectedItem < users.length - 1
              ? selectedItem + 1
              : users.length - 1
            : 0;
        setSelectedItem(selectedIndex);
      } else if (event.key === "Enter") {
        event.preventDefault();
        // Handle selection on pressing Enter
        if (selectedItem !== null) {
          const userId = users[selectedItem].id;
          (async () => {
            await addUser(userId);
            onReloadAgents();
          })();
        }
      }
    },
    [addUser, onReloadAgents, selectedItem, users],
  );

  return (
    <>
      <input
        type="text"
        onChange={(e) => updateQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {/* <p>{state}</p> */}
      {users.map((user, index) => (
        <FuzzyFinderUser
          key={user.id}
          selected={selectedItem !== null && selectedItem === index}
          user={user}
        />
      ))}
    </>
  );
}
