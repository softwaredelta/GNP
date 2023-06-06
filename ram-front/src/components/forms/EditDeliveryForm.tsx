// (c) Delta Software 2023, rights reserved.
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=1167543919
// * M1_S010
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import usePreviewImage from "../../hooks/usePreviewImage";
import useAxios from "../../hooks/useAxios";
import { IDeliveryDescription, ILink } from "../../types";
import LinkList from "../generics/lists/LinkList";
import { useUrlFile } from "../../lib/files";

export interface IEditDeliveryFormProps {
  delivery: IDeliveryDescription;
  deliveryId: string;
  handleLinkPost: (data: { link: string; name: string }) => void;
  handleLinkDelete: (id: string) => void;
  handleLinkEdit: (data: ILink) => void;
  updateDelivery: () => void;
}

export default function EditDeliveryForm({
  delivery,
  deliveryId,
  handleLinkPost,
  handleLinkEdit,
  handleLinkDelete,
  updateDelivery,
}: IEditDeliveryFormProps) {
  const [file, setFile] = useState<File | null | string>(null);

  const fileUrl = useUrlFile();

  const { setPreviewImage, imgRef } = usePreviewImage();

  const [enabled, setEnabled] = useState<string>();

  const { response, error, callback } = useAxios<IDeliveryDescription>({
    url: `deliveries/${deliveryId}`,
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  type FormValues = {
    deliveryName?: string;
    description?: string;
    hasDelivery?: string;
  };

  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      deliveryName: delivery?.deliveryName,
      description: delivery?.description,
      hasDelivery: delivery?.hasDelivery,
    },
  });

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
    if (enabled) {
      formData.append("hasDelivery", enabled);
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
        title: "¡Éxito!",
        text: "El entregable se ha modificado correctamente.",
        icon: "success",
      }).then(() => {
        updateDelivery();
      });
    }

    if (error) {
      console.log({ error });
      Swal.fire({
        title: "¡Error!",
        text: "Ocurrió un error al modificar el entregable.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }, [response, error]);

  return (
    <>
      <div className="justify-beetwen grid  grid-cols-2  place-items-center">
        <div className="row-span-2 flex w-full flex-col items-center justify-center">
          <div className="mt-5 mb-2 w-9/12">
            <label className=" text-xl font-semibold">
              Nombre del entregable
            </label>
          </div>
          <input
            type="text"
            defaultValue={delivery.deliveryName}
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
          <div className="mt-5 mb-2 w-9/12 ">
            <label className="text-left text-xl font-semibold">
              Descripción del entregable
            </label>
          </div>
          <textarea
            defaultValue={delivery.description}
            className="text-area-primary w-10/12 resize-none"
            {...register("description", {})}
          />

          <div className="mt-5 mb-2 w-9/12">
            <LinkList
              links={delivery.deliveryLinks}
              handlePost={(link, name) => {
                handleLinkPost({ link, name });
              }}
              handleDelete={(id) => handleLinkDelete(id)}
              handleEdit={(id, name, link) =>
                handleLinkEdit({ id, name, link })
              }
            />
          </div>
        </div>

        <div className="row-span-4 w-9/12">
          <div className="mt-10 aspect-video w-full overflow-hidden rounded-3xl border-4 border-gnp-orange-500">
            <img
              className="h-full w-full object-cover"
              src={fileUrl(delivery.imageUrl as string) || "/default.jfif"}
              ref={imgRef}
            />
          </div>
          <div className="flex w-11/12 place-items-center justify-center pt-8 pb-4">
            <input
              type="checkbox"
              defaultChecked={delivery.hasDelivery === "true" ? true : false}
              className="h-8 w-1/12 cursor-pointer rounded-lg border-2 border-gnp-blue-500 pl-3 shadow-lg transition duration-300 ease-in-out hover:scale-110 active:scale-95"
              onClick={() => {
                setEnabled(() => {
                  return delivery.hasDelivery === "true" ? "false" : "true";
                });
              }}
            />
            <div className="pl-4 text-xl font-semibold">
              ¿Requiere evidencia?
            </div>
          </div>
          <div className="col-start-1 w-full py-4">
            <label
              className="mb-2 block text-sm font-bold text-gray-700"
              htmlFor="file_input"
            >
              Selecciona una imagen para el entregable
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
            <p className="mt-1 pl-3 text-xs text-gray-500">JPG, PNG o JPEG</p>
          </div>
          <div className="flex w-full place-items-center justify-center pt-4">
            <div className="w-3/5">
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
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
