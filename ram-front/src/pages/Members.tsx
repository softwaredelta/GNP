// (c) Delta Software 2023, rights reserved.
import { useEffect } from "react";
import Swal from "sweetalert2";
import ModalAddUser from "../components/forms/ModalAddUser";
import TableMembers from "../components/members/TableMembers";
import Wrapper from "../containers/Wrapper";
import useAxios from "../hooks/useAxios";
import useModal from "../hooks/useModal";

// interface Props {
//   members?: IMembers[];
// }

export default function Members() {
  const { response, loading, error, callback } = useAxios({
    url: "user/create",
    method: "POST",
  });
  useEffect(() => {
    if (response) {
      Swal.fire({
        title: "Usuario creado",
        text: "El usuario se ha creado correctamente",
        icon: "success",
      });
    }
    if (error) {
      Swal.fire({
        title: "Error",
        text: `Ha ocurrido un error al crear el usuario.`,
        icon: "error",
      });
    }
  }, [response, error]);

  const { isOpen, toggleModal } = useModal();

  // TODO: Se tiene que hacer un endpoint que regrese todos los miembros registrados en la base de datos con el rol de "Agente"
  const tablemembers = [
    {
      id: "1",
      name: "Juan",
      lastName: "Perez",
      rol: "Agente",
      state: "Active",
      imageUrl: "https://flowbite.com/docs/images/people/profile-picture-5.jpg",
    },
    {
      id: "2",
      name: "Luis",
      lastName: "Gonzáles",
      rol: "Gerente",
      state: "Active",
      imageUrl: "https://flowbite.com/docs/images/people/profile-picture-5.jpg",
    },
  ];

  if (loading)
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

        <TableMembers members={tablemembers} />
      </>
    </Wrapper>
  );
}
