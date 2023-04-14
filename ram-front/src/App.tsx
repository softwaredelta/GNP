// (c) Delta Software 2023, rights reserved.

import { useRecoilValue } from "recoil";
import { apiBase$ } from "./lib/api/api-base";
import { apiTime$ } from "./lib/api/api-time";

function App() {
  const apiBase = useRecoilValue(apiBase$);
  const { now, update } = useRecoilValue(apiTime$);

  return (
    <div>
      <p data-testid="api-base">API base: {apiBase}</p>
      <button onClick={update}>Update Time</button>
      <p>{now}</p>
    </div>
  );
}

export default App;
