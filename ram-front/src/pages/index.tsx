// (c) Delta Software 2023, rights reserved.

import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthentication } from "../lib/api/api-auth";
import Examples from "../components/generics/Examples";
import { privateRoutes } from "../routes/privates";
import { publicRoutes } from "../routes/public";

export function AppRouter() {
  const { isAuthenticated } = useAuthentication();

  return (
    <Routes>
      {isAuthenticated ? (
        <>
          {privateRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<route.component />}
            />
          ))}
          <Route path="/login" element={<Navigate to="/" />} />
        </>
      ) : (
        <>
          {publicRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<route.component />}
            />
          ))}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<h1>404</h1>} />
        </>
      )}
    </Routes>
  );
}
