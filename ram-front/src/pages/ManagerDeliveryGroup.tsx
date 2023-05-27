// (c) Delta Software 2023, rights reserved.
import Wrapper from "../containers/Wrapper";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import { IDeliveryDescription, ILink } from "../types";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import usePreviewImage from "../hooks/usePreviewImage";

export default function ManagerDeliveryGroup(): JSX.Element {
  const [file, setFile] = useState<File | null | string>(null);

  const { id } = useParams();

  const { response: delivery } = useAxios<IDeliveryDescription>({
    url: `deliveries/group-delivery/${id}`,
    method: "GET",
  });

  const { setPreviewImage } = usePreviewImage();

  const [enabled, setEnabled] = useState<string>("false");

  const { response, error, callback } = useAxios({
    url: `deliveries/${id}`,
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

  type FormValuesLink = {
    name: string;
    link: string;
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
    // if (data.deliveryLinks) {
    //   formData.append("deliveryLinks", data.deliveryLinks);
    // }
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
        title: "Success!",
        text: "El entregable se ha modificado correctamente.",
        icon: "success",
      });
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
    <Wrapper title={"Editando entregable: " + delivery?.deliveryName || ""}>
      <div className="w-full rounded-3xl px-10">
        <div className="justify-beetwen grid  grid-cols-2  place-items-center">
          <div className="row-span-2 flex w-full flex-col items-center justify-center">
            <div className="mt-5 mb-2 w-9/12">
              <label className=" text-xl font-semibold">
                Nombre del entregable
              </label>
            </div>
            <input
              type="text"
              defaultValue={delivery?.deliveryName}
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
              defaultValue={delivery?.description}
              className="text-area-primary w-10/12 resize-none"
              {...register("description", {})}
            />

            <div className="mt-5 mb-2 w-9/12">
              <label className=" text-xl font-semibold">
                Links del entregable
              </label>
            </div>
            {/* <input
              type="text"
              defaultValue={delivery?.deliveryLinks}
              className="input-primary w-10/12"
              {...register("deliveryLinks", {
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
            /> */}
          </div>

          <div className="row-span-2 w-9/12">
            <div className="mt-10 aspect-video w-full overflow-hidden rounded-3xl border-4 border-gnp-orange-500">
              <img
                className="h-full w-full object-cover"
                src={delivery?.imageUrl || "/default.jfif"}
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
              <p className="mt-1 pl-3 text-xs text-gray-500">JPG, PNG o JPEG</p>
            </div>
          </div>
          <div className="w-11/12">
            <input
              type="checkbox"
              defaultChecked={delivery?.hasDelivery === "true" ? true : false}
              className="mb-8 h-12 w-1/12 cursor-pointer rounded-lg border-2 border-gnp-blue-500 pl-3 text-base shadow-lg"
              onClick={() => {
                setEnabled((prev) => {
                  return prev === "true" ? "false" : "true";
                });
              }}
            />
            <label className="pl-4 text-xl font-semibold">
              ¿Requiere evidencia?
            </label>
          </div>
          <div className="w-1/3">
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
    </Wrapper>
  );
}
