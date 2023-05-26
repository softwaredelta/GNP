// (c) Delta Software 2023, rights reserved.
import Wrapper from "../containers/Wrapper";
import { AiOutlinePlus } from "react-icons/ai";
import useModal from "../hooks/useModal";
import ModalProspectForm from "../components/forms/ModalProspectForm";
import useAxios from "../hooks/useAxios";
import { useEffect } from "react";
import { IStatus, IProspects } from "../types";
import Swal from "sweetalert2";
import ListProspects from "../components/prospects/ListProspects";

export default function Prospects() {
  const {
    response,
    loading: prospectsLoading,
    error: prospectsError,
  } = useAxios<{
    prospects: IProspects[];
  }>({
    url: "prospect/my-prospects",
    method: "GET",
  });

  const { isOpen, toggleModal } = useModal();
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
    callback,
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
      toggleModal();
    }

    if (prospectError) {
      Swal.fire({
        title: "Prospecto no agregado",
        text: "El prospecto no se ha agregado correctamente",
        icon: "error",
      });
    }

    if (prospectsError) {
      Swal.fire({
        title: "Error",
        text: "No se pudo obtener la lista de prospectos, intente más tarde",
        icon: "error",
      });
    }
  }, [
    statusResponse,
    statusError,
    prospectResponse,
    prospectError,
    prospectsError,
  ]);

  if (statusLoading || prospectLoading || prospectsLoading) {
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
              <button className="btn-primary" onClick={toggleModal}>
                Agregar prospecto
                <AiOutlinePlus className="ml-1 inline font-bold" />
              </button>
            </div>
          </div>

          <div>
            {response && <ListProspects prospects={response.prospects} />}
          </div>
        </div>
      </>
    </Wrapper>
  );
}
