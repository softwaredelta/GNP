// (c) Delta Software 2023, rights reserved.

import { LoginScreen } from "../components/auth/Login";
import useAlert from "../hooks/useAlert";
import useLoader from "../hooks/useLoader";
import { useAuthentication } from "../lib/api/api-auth";
import { useEffect } from "react";

export default function Login() {
  const { authenticate, isLoading, hasError, clearError } = useAuthentication();
  const { showAlert } = useAlert();
  const { setLoading } = useLoader();

  useEffect(() => {
    if (hasError) {
      showAlert(
        {
          type: "error",
          message: "Error de login",
          description: "Credenciales introducidas no válidas",
        },
        3,
      );
      clearError();
    }
  }, [hasError, clearError, showAlert]);

  useEffect(() => {
    if (isLoading !== undefined && setLoading) setLoading(isLoading);
  }, [isLoading, setLoading]);

  return (
    <LoginScreen onLogin={authenticate} isLoading={isLoading}></LoginScreen>
  );
}
