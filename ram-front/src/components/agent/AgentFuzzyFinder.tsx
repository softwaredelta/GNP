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
import { useUpdateGroups } from "../../lib/api/api-courses";
import Swal from "sweetalert2";

const TIMER_DELAY = 150;

function FuzzyFinderUser({
  selected,
  user,
  onClick,
}: {
  selected: boolean;
  user: IUser;
  onClick: () => void;
}) {
  const selectedClass = selected
    ? "text-white bg-gnp-blue-200 border-blue-700 border-1"
    : "";

  return (
    <li className={`${selectedClass} border-b-2 px-4 py-1`}>
      <button onClick={onClick}>
        {user.name} {user.lastName}
      </button>
    </li>
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
  const updateGroups = useUpdateGroups();

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
    [accessToken, apiBase, groupId],
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
            await addUser(userId as string);
            onReloadAgents();
            updateGroups();
          })();
        }
      }
    },
    [addUser, onReloadAgents, selectedItem, updateGroups, users],
  );

  return (
    <div className="flex flex-col">
      <input
        type="text"
        placeholder="Agregar agente. Comienza a escribir un nombre..."
        onChange={(e) => updateQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="rounded-lg shadow-md"
      />
      {/* <p>{state}</p> */}
      <div className="relative w-full">
        <ul className="absolute top-0 w-full bg-white">
          {users.map((user, index) => (
            <FuzzyFinderUser
              key={user.id}
              selected={selectedItem !== null && selectedItem === index}
              user={user}
              onClick={async () => {
                await addUser(user.id as string);
                Swal.fire({
                  title: "¡Agente agregado!",
                  text: "El agente se agregó correctamente al grupo",
                  icon: "success",
                  confirmButtonText: "OK",
                });
                onReloadAgents();
                updateGroups();
              }}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
