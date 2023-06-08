// (c) Delta Software 2023, rights reserved.
import LinkDelivery from "../components/deliverables/LinkDelivery";
import Wrapper from "../containers/Wrapper";
import { FileInput, Toast } from "flowbite-react";
import { useState, useEffect } from "react";
import DeliveryDescription from "../components/deliverables/DeliveryDescription";
import ImageURL from "../components/Image";
import { useParams } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import { IDeliveryDescription, IUserDelivery } from "../types";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { useOpenFile } from "../lib/files";
import { FiEye, FiSend } from "react-icons/fi";

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

  const {
    response: responsePostNoEvidence,
    callback: callBackPostNoEvidenceDelivery,
  } = useAxios<IUserDelivery>({
    url: `deliveries/update-status-no-evidence/${id}`,
    method: "POST",
  });

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
        title: "¡Éxito!",
        text: "El entregable se ha guardado correctamente.",
        icon: "success",
      });

      updateDeliveryStatus();
    } else if (responsePostNoEvidence) {
      updateDeliveryStatus();
    }
  }, [responsePost, responsePostNoEvidence]);

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
        title: "¡Error!",
        text: `No seleccionaste archivo.`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const { handleSubmit } = useForm<IUserDelivery>();

  function handleSubmitNoDelivery() {
    Swal.fire({
      title: "¿Quieres marcar esta tarea como completada?",
      text: "Confiamos que has completado esta tarea.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, marcar como completada",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        callBackPostNoEvidenceDelivery();
      }
    });
  }

  return (
    <Wrapper title={delivery?.deliveryName || ""}>
      <>
        <div className="flex justify-end pb-2">
          {delivery?.hasDelivery && delivery?.hasDelivery === "false" && (
            <Toast>
              <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gnp-blue-300 text-cyan-500 dark:bg-cyan-800 dark:text-cyan-200"></div>
              <div className="ml-3 text-sm">
                El entregable no requiere evidencia
              </div>
              <Toast.Toggle />
            </Toast>
          )}
        </div>
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
            {delivery?.hasDelivery && delivery?.hasDelivery === "true" && (
              <>
                {delivery?.imageUrl &&
                  (userDelivery?.status === "Enviado" ||
                    userDelivery?.status === "Aceptado") && (
                    <div className="pt-4">
                      <button
                        className="btn-primary flex h-12 items-center justify-center pt-10"
                        onClick={() =>
                          openFileInNewTab(userDelivery?.fileUrl || "")
                        }
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
                        className="btn-primary flex items-center justify-center pt-10"
                        onClick={handleSubmit(
                          () => {
                            uploadFile();
                          },
                          (errorsFields) => {
                            Swal.fire({
                              title: "¡Error!",
                              text: `Ocurrió un error al enviar la evidencia.\n
                ${Object.values(errorsFields).map((e) => e.message + " ")}`,
                              icon: "error",
                              confirmButtonText: "OK",
                            });
                          },
                        )}
                      >
                        <span className="text-lg font-semibold"> Enviar </span>
                        <FiSend size={20} className="ml-2" />
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
            {delivery?.hasDelivery &&
              delivery?.hasDelivery === "false" &&
              userDelivery?.status === "Sin enviar" && (
                <>
                  <div className="flex w-1/2 items-center justify-center pt-4">
                    <button
                      className="btn-primary flex items-center justify-center pt-10"
                      onClick={handleSubmitNoDelivery}
                    >
                      <span className="text-lg font-semibold"> Completar </span>
                      <FiSend size={20} className="ml-2" />
                    </button>
                  </div>
                </>
              )}

            {delivery?.hasDelivery &&
              delivery?.hasDelivery === "false" &&
              userDelivery?.status === "Aceptado" && (
                <>
                  <div className="col-span-1 mt-3 w-2/3 rounded-md bg-gnp-blue-500">
                    <p className="px-2 py-2 text-center font-semibold text-white">
                      Completado
                    </p>
                  </div>
                </>
              )}
          </div>
        </div>
      </>
    </Wrapper>
  );
}
