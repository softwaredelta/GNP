// (c) Delta Software 2023, rights reserved.
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=1001315964
// * M5_S01
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=334967464
// * M5_S02
import Wrapper from "../containers/Wrapper";
import { FiPlus } from "react-icons/fi";
import useModal from "../hooks/useModal";
import ModalProspectForm from "../components/forms/ModalProspectForm";
import useAxios from "../hooks/useAxios";
import { useEffect } from "react";
import { IStatus, IProspect } from "../types";
import Swal from "sweetalert2";
import ListProspects from "../components/prospects/ListProspects";

export default function Prospects() {
  const {
    response,
    loading: prospectsLoading,
    error: prospectsError,
    callback: refresh,
  } = useAxios<{
    prospects: IProspect[];
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

  const {
    response: newStatus,
    error: newStatusError,
    callback: newStatusCallBack,
  } = useAxios({
    url: `prospect/update-prospect`,
    method: "POST",
  });

  useEffect(() => {
    if (newStatus) {
      Swal.fire({
        title: "¡Éxito!",
        text: "El prospecto se ha actualizado correctamente.",
        icon: "success",
      }).then(() => {
        refresh();
      });
    }
    if (prospectResponse) {
      Swal.fire({
        title: "¡Éxito!",
        text: "El prospecto se ha agregado correctamente.",
        icon: "success",
      }).then(() => {
        refresh();
        toggleModal();
      });
    }
    if (statusError) {
      Swal.fire({
        title: "¡Error!",
        text: "No se pudo obtener la lista de estatus.",
        icon: "error",
      });
    }

    if (newStatusError) {
      Swal.fire({
        title: "¡Error!",
        text: "El estado del prospecto no se actualizo correctamente.",
        icon: "error",
      });
    }

    if (prospectError) {
      Swal.fire({
        title: "¡Error!",
        text: "El prospecto no se ha agregado correctamente.",
        icon: "error",
      });
    }

    if (prospectsError) {
      Swal.fire({
        title: "¡Error!",
        text: "No se pudo obtener la lista de prospectos, intente más tarde.",
        icon: "error",
      });
    }
  }, [
    statusResponse,
    statusError,
    prospectResponse,
    prospectError,
    prospectsError,
    newStatus,
  ]);

  if (statusLoading || prospectLoading || prospectsLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Wrapper>
      <>
        {statusResponse && response && (
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
                <FiPlus size={22} className="ml-1 inline font-bold" />
              </button>
            </div>
          </div>

          <div>
            {response && (
              <ListProspects
                listStatus={statusResponse as IStatus[]}
                prospects={response.prospects}
                handleStatusEdit={({ prospectId, statusId, statusComment }) => {
                  newStatusCallBack?.({ prospectId, statusId, statusComment });
                }}
              />
            )}
          </div>
        </div>
      </>
    </Wrapper>
  );
}
