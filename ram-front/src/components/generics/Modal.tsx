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
        className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-black/30"
        onClick={closeModal}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className=" relative h-[90vh] w-11/12 sm:w-10/12 md:h-[80vh] "
        >
          <button className=" absolute top-0 right-0 p-5" onClick={closeModal}>
            <AiOutlineClose
              size={40}
              className="fill-gray-800 transition-all ease-in-out hover:scale-125 hover:fill-[#FF595A] active:scale-90 "
            />
          </button>
          <div className="custom-scroll h-[80vh] w-full overflow-hidden overflow-y-scroll rounded-3xl bg-gnp-white py-20 px-10 md:px-20">
            {children}
          </div>
        </div>
      </div>
    </>,
    document.getElementById("modal-root") as HTMLElement,
  );
}
