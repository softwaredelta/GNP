// (c) Delta Software 2023, rights reserved.
import { useRef } from "react";
import usePreviewImage from "../../hooks/usePreviewImage";
import Modal from "../generics/Modal";

export interface IModalDeliveryFormProps {
  handlePost: (image: File | null, name: string, description: string) => void;
  closeModal: VoidFunction;
  isOpenModal: boolean;
}

export default function ModalDeliveryForm({
  handlePost,
  closeModal,
  isOpenModal,
}: IModalDeliveryFormProps) {
  const { image, setPreviewImage, imgRef, resetImage } = usePreviewImage();
  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  return (
    <>
      {isOpenModal && (
        <Modal
          withModal={false}
          closeModal={() => {
            closeModal();
            resetImage();
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className=" relative w-3/5 rounded-3xl bg-gnp-white p-10"
          >
            <h1 className="apply w-full rounded-xl bg-gnp-orange-500 p-4 text-center text-2xl font-semibold text-white">
              Agregar entregable
            </h1>
            <div className="justify-beetwen mt-10  grid  grid-cols-2  place-items-center">
              <div className="row-span-2 flex w-full flex-col items-center justify-center space-y-3">
                <div className="w-9/12">
                  <label className=" text-xl font-semibold">
                    Nombre del entregable
                  </label>
                </div>
                <input
                  ref={nameRef}
                  type="text"
                  className="input-primary w-10/12"
                />
                <div className="w-9/12 ">
                  <label className="text-left text-xl font-semibold">
                    Descripción del entregable
                  </label>
                </div>
                <textarea
                  ref={descriptionRef}
                  className="text-area-primary w-10/12 resize-none"
                />
              </div>

              <div className="row-span-2 w-9/12">
                <div className="aspect-video w-full overflow-hidden rounded-3xl border-4 border-gnp-orange-500">
                  <img
                    className="h-full w-full object-cover"
                    src={"/default.jfif"}
                    ref={imgRef}
                  />
                </div>
                <div className="col-start-1 w-full py-4">
                  <label
                    className="mb-2 block text-sm font-bold text-gray-700"
                    htmlFor="file_input"
                  >
                    Selecciona una imagen
                  </label>
                  <input
                    className="text-grat-700 focus-outline block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm"
                    type="file"
                    onChange={setPreviewImage}
                    placeholder="Selecciona una imagen"
                    accept=".jpg,.png,.jpeg"
                  />
                  <p className="mt-1 pl-3 text-xs text-gray-500">
                    JPG, PNG o JPEG
                  </p>
                </div>
              </div>
              <div className="w-11/12">
                <button
                  className="btn-border"
                  onClick={() => {
                    closeModal();
                    resetImage();
                  }}
                >
                  Cancelar
                </button>
              </div>
              <div className="w-11/12">
                <button
                  className="btn-primary"
                  onClick={() => {
                    if (nameRef.current) {
                      const nameGroup = nameRef.current.value.toString();
                      handlePost(
                        image,
                        nameGroup,
                        descriptionRef.current?.value.toString() || "",
                      );
                    }
                  }}
                >
                  Agregar
                </button>
              </div>
              {/* </div> */}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
