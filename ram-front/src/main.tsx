// (c) Delta Software 2023, rights reserved.

import ReactDOM from "react-dom/client";
import "./assets/css/index.css";
import React from "react";
import { App } from "./App";
import { AppRouter } from "./pages";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App hash="app">
      <AppRouter />
    </App>
  </React.StrictMode>,
);
if (window.location.pathname === "/") {
  window.location.replace("/app");
}
