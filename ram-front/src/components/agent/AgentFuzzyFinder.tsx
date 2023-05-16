// (c) Delta Software 2023, rights reserved.

import { useSetRecoilState } from "recoil";
import {
  fuzzyFinderQuery$,
  fuzzyFinderUsers$,
} from "../../lib/api/api-agent-fuzzy-finder";
import { useCallback, useState } from "react";
import { useLoadable } from "../../lib/loadable";
import { IUser } from "../../types";

const TIMER_DELAY = 300;

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

export default function AgentFuzzyFinder() {
  const setQuery = useSetRecoilState(fuzzyFinderQuery$);
  const [users /*, state*/] = useLoadable([], fuzzyFinderUsers$);
  const [timer, setTimer] = useState<null | ReturnType<typeof setTimeout>>(
    null,
  );
  const [selectedItem, setSelectedItem] = useState<null | number>(null);

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
          // console.log({ selected: users[selectedItem] });
        }
      }
    },
    [selectedItem, users],
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
