// (c) Delta Software 2023, rights reserved.

import { Navigate, Route, Routes } from "react-router-dom";
import { Home } from "./Home";
import { InfraTest } from "./InfraTest";
import { Login } from "./Login";
import { useRecoilValue } from "recoil";
import { isAuthenticated$ } from "../lib/auth/auth";

export function AppRouter() {
  const isAuthenticated = useRecoilValue(isAuthenticated$);

  return (
    <Routes>
      <Route path="/infra" element={<InfraTest />} />

      {isAuthenticated ? (
        <>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      ) : (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      )}
    </Routes>
  );
}
