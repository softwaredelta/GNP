// (c) Delta Software 2023, rights reserved.

import wip_3 from "../assets/imgs/wip_3.svg";
import Wrapper from "../containers/Wrapper";
import { AiOutlinePlus } from "react-icons/ai";
import useModal from "../hooks/useModal";
import ModalProspectForm from "../components/forms/ModalProspectForm";
import useAxios from "../hooks/useAxios";
import { useEffect } from "react";
import { IStatus } from "../types";
import Swal from "sweetalert2";

export default function Prospects() {
  const { isOpen, toggleModal } = useModal(true);
  const {
    response: statusResponse,
    error: statusError,
    loading: statusLoading,
  } = useAxios<IStatus[]>({
    url: "status/all",
    method: "GET",
  });

  const {
    response: prospectResponse,
    error: prospectError,
    loading: prospectLoading,
    callback // Renombrar el callbacj¿k,
  } = useAxios({
    url: "prospect/create",
    method: "POST",
  });

  useEffect(() => {
    if (statusError) {
      Swal.fire({
        title: "Error",
        text: "No se pudo obtener la lista de estatus",
        icon: "error",
      });
    }

    if (prospectResponse) {
      Swal.fire({
        title: "Prospecto agregado",
        text: "El prospecto se ha agregado correctamente",
        icon: "success",
      });
    }

    if (prospectError) {
      Swal.fire({
        title: "Prospecto no agregado",
        text: "El prospecto no se ha agregado correctamente",
        icon: "error",
      });
    }
  }, [statusResponse, statusError, prospectResponse, prospectError]);

  if (statusLoading || prospectLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Wrapper>
      <>
        {statusResponse && (
          <ModalProspectForm
            isOpenModal={isOpen}
            closeModal={toggleModal}
            listStatus={statusResponse}
            handlePost={(data) => {
              if (callback) {
                callback(data);
              }
            }}
          />
        )}
        <div className="mt-8">
          <div className=" flex justify-end px-5">
            <div className="flex">
              <button className="btn-secondary" onClick={toggleModal}>
                Agregar prospecto
                <AiOutlinePlus className="ml-1 inline font-bold" />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center p-4">
            <img
              src={wip_3}
              className="h-1/2 w-1/2 md:h-1/5 md:w-1/5"
              alt="Work in progress"
            />
          </div>
          <h1 className="flex justify-center text-3xl font-bold text-gnp-blue-900">
            Estamos trabajando en
          </h1>
          <h1 className="flex justify-center text-3xl font-bold text-orange-500">
            Prospectos
          </h1>
        </div>
      </>
    </Wrapper>
  );
}
