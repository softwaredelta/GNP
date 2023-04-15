// (c) Delta Software 2023, rights reserved.

import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/css/index.css";
import { RecoilRoot } from "recoil";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./pages/AppRouter";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <React.Suspense fallback={<p>loading site...</p>}>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </React.Suspense>
    </RecoilRoot>
  </React.StrictMode>,
);
