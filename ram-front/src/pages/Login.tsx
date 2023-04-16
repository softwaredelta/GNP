// (c) Delta Software 2023, rights reserved.

import LoginForm from "../components/auth/LoginForm";
import { useAuthentication } from "../lib/api/api-auth";

export function Login() {
  const { authenticate } = useAuthentication();

  return <LoginForm onLogin={authenticate}></LoginForm>;
}
