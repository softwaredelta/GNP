// (c) Delta Software 2023, rights reserved.

import { useState } from "react";
import reactLogo from "./assets/imgs/react.svg";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App bg-sky-500">
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <p className="text-3xl font-bold underline hover:underline-offset-4">
        Hello world!
      </p>
    </div>
  );
}

export default App;
