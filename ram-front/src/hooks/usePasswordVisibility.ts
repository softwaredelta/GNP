// (c) Delta Software 2023, rights reserved.

import { useState } from "react";

export interface UsePasswordVisibilityReturn {
  handlePasswordVisibility: () => void;
  typeInput: () => string;
  passwordVisible: boolean;
}

export default function usePasswordVisibility(): UsePasswordVisibilityReturn {
  const [passwordVisible, setpasswordVisible] = useState<boolean>(false);

  const handlePasswordVisibility = (): void => {
    setpasswordVisible(!passwordVisible);
  };

  const typeInput = (): string => {
    return passwordVisible ? "text" : "password";
  };

  return { handlePasswordVisibility, typeInput, passwordVisible };
}
