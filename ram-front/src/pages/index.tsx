// (c) Delta Software 2023, rights reserved.

import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthentication } from "../lib/api/api-auth";
import {
  CommonUserRoutes,
  ManagerUserRoutes,
  RegularUserRoutes,
} from "../routes/privates";
import { PublicRoutes } from "../routes/public";
import { AlertsContainer } from "../components/generics/alerts/Alert";
import { useRecoilValue } from "recoil";
import { isTest$ } from "../lib/api/api-base";
import { useCallback, useMemo } from "react";
import { IRoute } from "../types";

export function AppRouter() {
  const { auth, isAuthenticated } = useAuthentication();
  const isTest = useRecoilValue(isTest$);

  const hasRole = useCallback(
    (role: string) => {
      if (auth === null) return false;

      return auth.roles.includes(role);
    },
    [auth],
  );

  const availableRoutes = useMemo((): IRoute[] => {
    const routes: IRoute[] = [];

    if (isAuthenticated) {
      routes.push(...CommonUserRoutes);
    } else {
      routes.push(...PublicRoutes);
      routes.push({ path: "*", Component: () => <Navigate to="/login" /> });
    }

    if (isAuthenticated && hasRole("regular")) {
      routes.push(...RegularUserRoutes);
    }

    if (isAuthenticated && hasRole("manager")) {
      routes.push(...ManagerUserRoutes);
    }

    if (isAuthenticated) {
      routes.push({ path: "*", Component: () => <Navigate to="/" /> });
    }

    return routes;
  }, [hasRole, isAuthenticated]);

  return (
    <>
      {isTest || <AlertsContainer />}

      <Routes>
        {availableRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      </Routes>
    </>
  );
}
