// (c) Delta Software 2023, rights reserved.

import { useRecoilValue } from "recoil";
import {
  AuthenticationApi,
  AuthenticationContext,
  authenticationApi$,
} from "./api-auth";

export function ApiProvider({
  hash,
  children,
}: {
  hash: string;
  children: React.ReactNode;
}) {
  const authentication: AuthenticationApi = useRecoilValue(
    authenticationApi$({ hash }),
  );

  return (
    <AuthenticationContext.Provider value={authentication}>
      {children}
    </AuthenticationContext.Provider>
  );
}
