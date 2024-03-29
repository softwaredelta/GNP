// (c) Delta Software 2023, rights reserved.
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=1943755342
// * M1_S08
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=819425274
// * M1_S09
import { useRef, useState } from "react";
import usePreviewImage from "../../hooks/usePreviewImage";
import { IGroup } from "../../types";
import Modal from "../generics/Modal";
import { useUrlFile } from "../../lib/files";

export interface IModalGroupFormProps {
  handlePost: (image: File | null | string, name: string) => void;
  closeModal: VoidFunction;
  isOpenModal: boolean;
  isEditModal: boolean;
  initialValues?: IGroup;
}

export default function ModalGroupForm({
  handlePost,
  closeModal,
  isOpenModal,
  isEditModal,
  initialValues,
}: IModalGroupFormProps) {
  const { setPreviewImage, imgRef, resetImage } = usePreviewImage();
  const [file, setFile] = useState<File | null | string>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const fileUrl = useUrlFile();

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
            data-testid="modal-group"
          >
            <h1
              className={`apply w-full rounded-xl ${
                isEditModal ? "bg-gnp-blue-600" : "bg-gnp-orange-500"
              } p-4 text-center text-2xl font-semibold text-white`}
            >
              {isEditModal ? "Editar Grupo" : "Crear Grupo"}
            </h1>
            <div className="justify-beetwen mt-10 flex grid grid-cols-2  place-items-center">
              <div className="flex w-full flex-col items-center justify-center space-y-3">
                <label className="text-xl font-semibold">
                  Nombre del grupo
                </label>
                <input
                  ref={nameRef}
                  type="text"
                  className="input-primary w-10/12"
                  defaultValue={initialValues?.name}
                />
              </div>
              <div className="row-span-2 w-9/12">
                <div
                  className={`aspect-video w-full overflow-hidden rounded-3xl border-4 ${
                    isEditModal
                      ? "border-b-gnp-blue-500"
                      : "border-gnp-orange-500"
                  }`}
                >
                  <img
                    className="h-full w-full object-cover"
                    src={
                      fileUrl(initialValues?.imageUrl as string) ||
                      "/default.jfif"
                    }
                    ref={imgRef}
                  />
                </div>
              </div>
              <div className="col-start-1 w-10/12 py-4">
                <label
                  className="mb-2 block text-sm font-bold text-gray-700"
                  htmlFor="file_input"
                >
                  Selecciona una imagen
                </label>
                <input
                  className="text-grat-700 focus-outline block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm"
                  type="file"
                  onChange={(e) => {
                    if (e.target.files) {
                      setFile(e.target.files[0]);
                      setPreviewImage(e);
                    } else setFile(null);
                  }}
                  placeholder="Selecciona una imagen"
                  accept=".jpg,.png,.jpeg"
                />
                <p className="mt-1 pl-3 text-sm text-gray-500">
                  JPG, PNG o JPEG
                </p>
              </div>
              <div className="w-11/12 pt-5">
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
              <div className="w-11/12 pt-5">
                <button
                  className="btn-primary"
                  onClick={() => {
                    if (nameRef.current) {
                      const nameGroup = nameRef.current.value.toString();
                      handlePost(file, nameGroup);
                      closeModal();
                    }
                  }}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
