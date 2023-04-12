// (c) Delta Software 2023, rights reserved.

import { useRecoilValue } from "recoil";
import { databaseTimeSelector } from "./state/api.state";
import { Suspense, useState } from "react";

function DatabaseTimeDisplay() {
  const time = useRecoilValue(databaseTimeSelector);

  return <span className="text-center">{time}</span>;
}

function App() {
  const [showTime, setShowTime] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={() => {
          setShowTime(!showTime);
        }}
      >
        {showTime ? "Hide" : "Show"} time
      </button>
      {showTime && (
        <Suspense
          fallback={<span className="text-center">loading time...</span>}
        >
          <DatabaseTimeDisplay />
        </Suspense>
      )}
    </div>
  );
}

export default App;
