// (c) Delta Software 2023, rights reserved.
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=2023282790
// * M4_S01

import { useEffect } from "react";
import Swal from "sweetalert2";
import ModalAddUser from "../components/forms/ModalAddUser";
import TableMembers from "../components/members/TableMembers";
import Wrapper from "../containers/Wrapper";
import useAxios from "../hooks/useAxios";
import useModal from "../hooks/useModal";
import { IMembers } from "../types";
export default function Members() {
  const { isOpen, toggleModal } = useModal();
  const {
    response: membersResponse,
    loading: loadingMembers,
    error: errorMembers,
    callback: refreshMembers,
  } = useAxios<IMembers[]>({
    url: "user/members",
    method: "GET",
  });

  const {
    response: createResponse,
    loading: createLoading,
    error: createError,
    callback,
  } = useAxios({
    url: "user/create",
    method: "POST",
  });
  useEffect(() => {
    if (createResponse) {
      Swal.fire({
        title: "¡Éxito!",
        text: "El usuario se ha creado correctamente",
        icon: "success",
      });
      refreshMembers();
      toggleModal();
    }
    if (createError) {
      Swal.fire({
        title: "¡Error!",
        text: `Ha ocurrido un error al crear el usuario.`,
        icon: "error",
      });
    }
  }, [createResponse, createError]);

  if (loadingMembers) return <h1>Loading ...</h1>;
  if (errorMembers) return <h1>Error ...</h1>;

  if (createLoading)
    return (
      <Wrapper>
        <h1 className="title">Cargando...</h1>
      </Wrapper>
    );

  return (
    <Wrapper title="Miembros">
      <>
        <div className="flex w-full items-center justify-end px-5 py-2">
          <ModalAddUser
            handlePost={(data) => {
              if (callback) callback(data);
            }}
            isOpenModal={isOpen}
            closeModal={toggleModal}
          />

          <div className="w-1/12 overflow-hidden rounded-3xl font-bold">
            <button onClick={toggleModal} className="btn-primary">
              Agregar
            </button>
          </div>
        </div>

        <div className="mt-5 flex w-full justify-center">
          {membersResponse && (
            <div className="w-4/5">
              <TableMembers members={membersResponse} />
            </div>
          )}
        </div>
      </>
    </Wrapper>
  );
}
