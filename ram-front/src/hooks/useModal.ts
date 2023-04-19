// (c) Delta Software 2023, rights reserved.

import { useState } from "react";

export interface UseModalReturn {
  isOpen: boolean;
  toggleModal: () => void;
}

export default function useModal(initialState = false): UseModalReturn {
  const [isOpen, setIsOpen] = useState(initialState);

  const toggleModal = () => {
    setIsOpen((prev) => !prev);
  };

  return { isOpen, toggleModal };
}
