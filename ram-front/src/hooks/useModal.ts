import { useState } from "react";

export interface UseModalReturn {
  isOpen: boolean;
  toggleModal: () => void;
}

export default function useModal(
  initialState: boolean = false,
): UseModalReturn {
  const [isOpen, setIsOpen] = useState(initialState);

  const toggleModal = () => {
    setIsOpen((prev) => !prev);
  };

  return { isOpen, toggleModal };
}
