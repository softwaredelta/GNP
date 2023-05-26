// (c) Delta Software 2023, rights reserved.
import LinkDelivery from "../components/deliverables/LinkDelivery";
import Wrapper from "../containers/Wrapper";
import { FileInput } from "flowbite-react";
import { useState, useEffect } from "react";
import { TbSend } from "react-icons/tb";
import DeliveryDescription from "../components/deliverables/DeliveryDescription";
import ImageURL from "../components/Image";
import { useParams } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import { IDeliveryDescription, IUserDelivery } from "../types";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { useOpenFile } from "../lib/files";
import { FiEye } from "react-icons/fi";

export default function DeliveryGroup(): JSX.Element {
  const [file, setFile] = useState<File | null | string>(null);

  const { id } = useParams();
  const openFileInNewTab = useOpenFile();

  const { response: userDelivery, callback: updateDeliveryStatus } =
    useAxios<IUserDelivery>({
      url: `user-delivery/${id}/auth`,
      method: "GET",
    });

  const { response: delivery } = useAxios<IDeliveryDescription>({
    url: `deliveries/group-delivery/${id}`,
    method: "GET",
  });

  console.log("User delivery");
  console.log(userDelivery);

  const { response: responsePost, callback } = useAxios<{
    dateDelivery: string;
    deliveryId: string;
    fileUrl: string;
    status: string;
    userId: string;
  }>({
    url: `user-delivery/upload/${id}`,
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  useEffect(() => {
    if (responsePost) {
      Swal.fire({
        title: "Success!",
        text: "El entregable se ha guardado correctamente.",
        icon: "success",
      });

      updateDeliveryStatus();
    }
  }, [responsePost]);

  const uploadFile = (): void => {
    if (file) {
      const formData: FormData = new FormData();
      formData.append("file", file);
      try {
        callback?.(formData);
      } catch (err) {
        console.error(err);
      }
    } else {
      Swal.fire({
        title: "Error!",
        text: `No seleccionaste archivo.`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const { handleSubmit } = useForm<IUserDelivery>();

  return (
    <Wrapper title={delivery?.deliveryName || ""}>
      <div className="grid w-full grid-cols-7 gap-12 px-14">
        <div className="col-span-4 px-8">
          <DeliveryDescription description={delivery?.description || ""} />
          <h1 className="pt-8 text-2xl font-semibold  text-gnp-orange-500">
            Links
          </h1>
          <div className="px-12 text-lg">
            <LinkDelivery links={delivery?.deliveryLinks ?? []} />
          </div>
        </div>
        <div className="col-span-3 flex w-4/5 flex-col items-center pl-4">
          <div className="mx-auto flex w-4/5 items-center justify-center">
            <ImageURL url={delivery?.imageUrl || "/default.jfif"} />
          </div>
          {delivery?.imageUrl &&
            (userDelivery?.status === "Enviado" ||
              userDelivery?.status === "Aceptado") && (
              <div className="pt-4">
                <button
                  className="btn-primary flex h-12 items-center justify-center pt-10"
                  onClick={() => openFileInNewTab(userDelivery?.fileUrl || "")}
                >
                  <span className="text-sm font-semibold">
                    {" "}
                    Ver documento enviado{" "}
                  </span>
                  <FiEye className="ml-2" color="white" size={20} />
                </button>
              </div>
            )}
          {(userDelivery?.status === "Sin enviar" ||
            userDelivery?.status === "Rechazado") && (
            <>
              <FileInput
                id="file"
                className="w-full pt-6 text-xs"
                onChange={(e: any) => {
                  if (e.target.files) {
                    setFile(e.target.files[0]);
                  } else setFile(null);
                }}
                helperText="Sube la evidencia de la entrega"
              />
              <div className="flex w-1/2 items-center justify-center pt-4">
                <button
                  className="btn-primary flex h-8 items-center justify-center pt-10"
                  onClick={handleSubmit(
                    () => {
                      uploadFile();
                    },
                    (errorsFields) => {
                      Swal.fire({
                        title: "Error!",
                        text: `Ocurrió un error al enviar la evidencia.\n
                ${Object.values(errorsFields).map((e) => e.message + " ")}`,
                        icon: "error",
                        confirmButtonText: "OK",
                      });
                    },
                  )}
                >
                  <span className="text-lg font-semibold"> Enviar </span>
                  <TbSend size={20} className="ml-2" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Wrapper>
  );
}
