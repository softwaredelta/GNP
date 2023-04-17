// (c) Delta Software 2023, rights reserved.

import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/css/index.css";
import { RecoilRoot } from "recoil";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { InfraTest } from "./pages/InfraTest";
import { NewSale } from "./pages/NewSale";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <React.Suspense fallback={<p>loading site...</p>}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/infra" element={<InfraTest />} />
            <Route path="/newSale" element={<NewSale />} />
            <Route path="*" element={<h1>404</h1>} />
          </Routes>
        </BrowserRouter>
      </React.Suspense>
    </RecoilRoot>
  </React.StrictMode>,
);
