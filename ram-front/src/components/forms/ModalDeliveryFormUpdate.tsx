// (c) Delta Software 2023, rights reserved.
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxios from "../../hooks/useAxios";
import usePreviewImage from "../../hooks/usePreviewImage";
import { IDelivery } from "../../types";
import Modal from "../generics/Modal";

export interface IModalDeliveryFormProps {
  closeModal: VoidFunction;
  isOpenModal: boolean;
  deliveryId: string;
  initialValues?: IDelivery;
}

export default function ModalDeliveryFormUpdate({
  closeModal,
  isOpenModal,
  deliveryId,
  initialValues,
}: IModalDeliveryFormProps) {
  const { setPreviewImage, imgRef, resetImage } = usePreviewImage();
  const [file, setFile] = useState<File | null>(null);

  const { response, error, callback } = useAxios({
    url: `deliveries/${deliveryId}`,
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  type FormValues = {
    deliveryName?: string;
    description?: string;
  };

  const { register, handleSubmit, reset } = useForm<FormValues>();

  const uploadFile = (data: FormValues) => {
    const formData: FormData = new FormData();
    if (file) {
      formData.append("image", file);
    }
    if (data.deliveryName) {
      formData.append("deliveryName", data.deliveryName);
    }
    if (data.description) {
      formData.append("description", data.description);
    }
    try {
      callback?.(formData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (response) {
      Swal.fire({
        title: "Success!",
        text: "El entregable se ha modificado correctamente.",
        icon: "success",
      });
      reset({
        deliveryName: "",
        description: "",
      });
      closeModal();
    }

    if (error) {
      console.log({ error });
      Swal.fire({
        title: "Error!",
        text: `Ocurrió un error al modificar el entregable.\n
        ${(error as any).response.data.message}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }, [response, error]);

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
              Editar entregable
            </h1>
            <div className="justify-beetwen mt-10  grid  grid-cols-2  place-items-center">
              <div className="row-span-2 flex w-full flex-col items-center justify-center space-y-3">
                <div className="w-9/12">
                  <label className=" text-xl font-semibold">
                    Nombre del entregable
                  </label>
                </div>
                <input
                  type="text"
                  defaultValue={initialValues?.deliveryName}
                  className="input-primary w-10/12"
                  {...register("deliveryName", {
                    required: "El campo nombre del entregable requerido.",
                    minLength: {
                      value: 3,
                      message: "El nombre debe tener al menos 3 caracteres",
                    },
                    maxLength: {
                      value: 50,
                      message: "El nombre debe tener máximo 50 caracteres",
                    },
                  })}
                />
                <div className="w-9/12 ">
                  <label className="text-left text-xl font-semibold">
                    Descripción del entregable
                  </label>
                </div>
                <textarea
                  defaultValue={initialValues?.description}
                  className="text-area-primary w-10/12 resize-none"
                  {...register("description", {})}
                />
              </div>

              <div className="row-span-2 w-9/12">
                <div className="aspect-video w-full overflow-hidden rounded-3xl border-4 border-gnp-orange-500">
                  <img
                    className="h-full w-full object-cover"
                    src={initialValues?.imageUrl || "/default.jfif"}
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
                    onChange={(e) => {
                      if (e.target.files) {
                        setFile(e.target.files[0]);
                        setPreviewImage(e);
                      } else setFile(null);
                    }}
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
                  onClick={handleSubmit(uploadFile, (errorsFields) => {
                    Swal.fire({
                      title: "Error!",
                      text: `Ocurrió un error al modificar el entregable.\n
                        ${Object.values(errorsFields).map(
                          (e) => e.message + " ",
                        )}`,
                      icon: "error",
                      confirmButtonText: "OK",
                    });
                  })}
                >
                  Editar
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
