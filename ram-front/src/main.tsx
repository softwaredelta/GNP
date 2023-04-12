// (c) Delta Software 2023, rights reserved.

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./assets/css/index.css";
import { RecoilRoot } from "recoil";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <React.Suspense fallback={<p>loading...</p>}>
        <App />
      </React.Suspense>
    </RecoilRoot>
  </React.StrictMode>,
);
