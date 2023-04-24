// (c) Delta Software 2023, rights reserved.

import { LoginScreen } from "../components/auth/Login";
import useAlert from "../hooks/useAlert";
import { useAuthentication } from "../lib/api/api-auth";
import { useEffect } from "react";

export default function Login() {
  const { authenticate, isLoading, hasError, clearError } = useAuthentication();
  const { showAlert } = useAlert();

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

  return (
    <LoginScreen onLogin={authenticate} isLoading={isLoading}></LoginScreen>
  );
}
