// (c) Delta Software 2023, rights reserved.

import { useEffect, useState } from "react";

export interface IUseAlertReturn {
  isOpen: boolean;
  toggleAlert: () => void;
}

export default function useAlert(
  initialState = false,
  time = 5,
): IUseAlertReturn {
  const [isOpen, setIsOpen] = useState(initialState);

  const toggleAlert = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isOpen) {
      const timeout = setTimeout(() => {
        setIsOpen(false);
      }, time * 1000);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, time]);

  return { isOpen, toggleAlert };
}
