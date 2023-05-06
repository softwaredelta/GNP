// (c) Delta Software 2023, rights reserved.

import { ReactNode, useEffect } from "react";
import ReactDOM from "react-dom";
import { AiOutlineClose } from "react-icons/ai";

export interface IModalProps {
  children: ReactNode;
  closeModal: () => void;
}

export default function Modal({
  children,
  closeModal,
}: IModalProps): JSX.Element {
  useEffect(() => {
    if (typeof window != "undefined" && window.document)
      document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return ReactDOM.createPortal(
    <>
      <div
        className="fixed top-0 left-0 z-50 bg-black/30 w-full h-full grid grid-cols-1 grid-rows-1 content-center"
        onClick={closeModal}
      >
        <div onClick={(e) => e.stopPropagation()} className="min-w-fit">
          {children}
        </div>
      </div>
    </>,
    document.getElementById("modal-root") as HTMLElement,
  );
}
