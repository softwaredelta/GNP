// (c) Delta Software 2023, rights reserved.

import { useRecoilValue } from "recoil";
import { databaseTimeSelector } from "./state/api.state";
import { Suspense, useState } from "react";
import { Button } from "./components/button";

function DatabaseTimeDisplay() {
  const time = useRecoilValue(databaseTimeSelector);

  return <span className="text-center">{time}</span>;
}

function App() {
  const [showTime, setShowTime] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <Button
        variant={showTime ? Button.Secondary : Button.Primary}
        className="font-bold"
        onClick={() => {
          setShowTime(!showTime);
        }}
      >
        {showTime ? "Hide" : "Show"} time
      </Button>
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
