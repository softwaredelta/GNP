// (c) Delta Software 2023, rights reserved.

import { LoginScreen } from "../components/auth/Login";
import { useAuthentication } from "../lib/api/api-auth";

export function Login() {
  const { authenticate } = useAuthentication();

  return <LoginScreen onLogin={authenticate}></LoginScreen>;
}
