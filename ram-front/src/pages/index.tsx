// (c) Delta Software 2023, rights reserved.

import { Navigate, Route, Routes } from "react-router-dom";
import { InfraTest } from "./InfraTest";
import { Home } from "./Home";
import { useAuthentication } from "../lib/api/api-auth";
import { Login } from "./Login";

export function AppRouter() {
  const { isAuthenticated } = useAuthentication();

  return (
    <Routes>
      <Route path="/infra" element={<InfraTest />} />
      {isAuthenticated ? (
        <>
          <Route path="/" element={<Home />} />
          {/* <Route path="/infra" element={<InfraTest />} /> */}
          <Route path="/login" element={<Navigate to="/" />} />
          <Route path="*" element={<h1>404</h1>} />
        </>
      ) : (
        <>
          <Route path="/" element={<Navigate to="/login" />} />
          {/* <Route path="/infra" element={<InfraTest />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<h1>404</h1>} />
        </>
      )}
    </Routes>
  );
}
