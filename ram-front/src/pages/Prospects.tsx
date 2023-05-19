// (c) Delta Software 2023, rights reserved.

import wip_3 from "../assets/imgs/wip_3.svg";
import Wrapper from "../containers/Wrapper";
import { AiOutlinePlus } from "react-icons/ai";
import useModal from "../hooks/useModal";
import ModalProspectForm from "../components/forms/ModalProspectForm";
import useAxios from "../hooks/useAxios";
import { useEffect } from "react";
import { IStatus } from "../types";
import {IProspects} from "../types";
import Swal from "sweetalert2";
import RowProspect from "../components/prospects/RowProspect";
import ListProspects from "../components/prospects/ListProspects";

export default function Prospects() {
  const { response, loading, error } = useAxios<{
    prospects: IProspects[];
  }>({
    url: "prospect/my-prospects",
    method: "GET",
  });

  console.log("response");
  console.log(response);

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

          <div className="">  
            {response && (
              <ListProspects
                prospects={response.prospects}

              />
            )}  
          </div>

        </div>
      </>
    </Wrapper>
  );
}
