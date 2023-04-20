// (c) Delta Software 2023, rights reserved.

import { Navigate, Route, Routes } from "react-router-dom";
import { InfraPage } from "./InfraTest";
import { Home } from "./Home";
import { useAuthentication } from "../lib/api/api-auth";
import { Login } from "./Login";
import Examples from "../components/generics/Examples";
import { ManagerCourses } from "./ManagerCourses";

export function AppRouter() {
  const { isAuthenticated } = useAuthentication();

  return (
    <Routes>
      <Route path="/infra" element={<InfraPage />} />
      <Route path="/components" element={<Examples />} />
      {isAuthenticated ? (
        <>
          <Route path="/" element={<Home />} />
          <Route path="/managerCourses" element={<ManagerCourses />} />
          <Route path="/login" element={<Navigate to="/" />} />
          <Route path="*" element={<h1>404</h1>} />
        </>
      ) : (
        <>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<h1>404</h1>} />
        </>
      )}
    </Routes>
  );
}
