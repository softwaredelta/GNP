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
        className="fixed top-0 left-0 z-50 bg-black/30 w-full h-full flex items-center justify-center"
        onClick={closeModal}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className=" relative w-11/12 sm:w-10/12 h-[90vh] md:h-[80vh] "
        >
          <button className=" absolute top-0 right-0 p-5" onClick={closeModal}>
            <AiOutlineClose
              size={40}
              className="hover:fill-[#FF595A] fill-gray-800 hover:scale-125 active:scale-90 transition-all ease-in-out "
            />
          </button>
          <div className="w-full py-20 px-10 md:px-20 h-[80vh] overflow-hidden overflow-y-scroll bg-gnp-white rounded-3xl custom-scroll">
            {children}
          </div>
        </div>
      </div>
    </>,
    document.getElementById("modal-root") as HTMLElement,
  );
}
