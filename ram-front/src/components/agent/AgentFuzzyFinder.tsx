// (c) Delta Software 2023, rights reserved.

import { useSetRecoilState } from "recoil";
import {
  fuzzyFinderQuery$,
  fuzzyFinderUsers$,
} from "../../lib/api/api-agent-fuzzy-finder";
import { useCallback, useState } from "react";
import { useLoadable } from "../../lib/loadable";

const TIMER_DELAY = 300;

function UsersList() {
  const [users /*, state*/] = useLoadable([], fuzzyFinderUsers$);

  return (
    <>
      {/* <p>{state}</p> */}
      {users.map((user) => (
        <div key={user.id}>
          {user.name} {user.lastName}
        </div>
      ))}
    </>
  );
}

export default function AgentFuzzyFinder() {
  const setQuery = useSetRecoilState(fuzzyFinderQuery$);
  const [timer, setTimer] = useState<null | ReturnType<typeof setTimeout>>(
    null,
  );
  const updateQuery = useCallback(
    (query: string) => {
      if (timer) {
        clearTimeout(timer);
      }
      const newTimer = setTimeout(() => {
        setQuery(query);
        setTimer(null);
      }, TIMER_DELAY);
      setTimer(newTimer);
    },
    [setQuery, timer],
  );

  return (
    <>
      <input type="text" onChange={(e) => updateQuery(e.target.value)} />
      <UsersList />
    </>
  );
}
