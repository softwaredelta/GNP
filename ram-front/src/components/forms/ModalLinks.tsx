// (c) Delta Software 2023, rights reserved.
import { useRef } from "react";
import { ILink } from "../../types";
import Modal from "../generics/Modal";

export interface IModalLinksProps {
  handlePost: (url: string, name: string) => void;
  closeModal: VoidFunction;
  isOpenModal: boolean;
  isEditModal: boolean;
  initialValues?: ILink;
}

export default function ModalLinks({
  handlePost,
  closeModal,
  isOpenModal,
  isEditModal,
  initialValues,
}: IModalLinksProps) {
  const nameRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);

  return (
    <>
      {isOpenModal && (
        <Modal
          withModal={false}
          closeModal={() => {
            closeModal();
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className=" relative w-1/2 rounded-3xl bg-gnp-white p-10"
          >
            <h1
              className={`apply w-full rounded-xl ${
                isEditModal ? "bg-gnp-blue-600" : "bg-gnp-orange-500"
              } p-4 text-center text-2xl font-semibold text-white`}
            >
              {isEditModal ? "Editar Link" : "Crear Link"}
            </h1>

            <div className="mt-10 grid grid-cols-5 gap-8">
              <div className="col-span-2">
                <label className="text-xl font-semibold">Texto</label>
                <input
                  ref={nameRef}
                  type="text"
                  className="input-primary w-10/12"
                  defaultValue={initialValues?.name}
                />
              </div>
              <div className="col-span-3">
                <label className="text-xl font-semibold">Hipervínculo</label>
                <input
                  ref={urlRef}
                  type="text"
                  className="input-primary w-10/12"
                  defaultValue={initialValues?.link}
                />
              </div>
            </div>
            <div className="mt-10 grid grid-cols-2">
              <div className="flex flex-col items-center">
                <div className="w-4/5">
                  <button
                    className="btn-border"
                    onClick={() => {
                      closeModal();
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-4/5">
                  <button
                    className="btn-primary"
                    onClick={() => {
                      if (nameRef.current && urlRef.current) {
                        const nameLink = nameRef.current.value.toString();
                        const urlLink = urlRef.current?.value.toString();
                        handlePost(urlLink, nameLink);
                      }
                    }}
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
