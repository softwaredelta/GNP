// (c) Delta Software 2023, rights reserved.

import Swal from "sweetalert2";
import useAxios from "../hooks/useAxios";
import { useEffect } from "react";
import Wrapper from "../containers/Wrapper";
import UserForm from "../components/forms/UserForm";

export default function AddUser() {
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

  if (loading)
    return (
      <Wrapper>
        <h1 className="title">Cargando...</h1>
      </Wrapper>
    );

  return (
    <Wrapper>
      <div className="flex w-full flex-col space-y-5">
        <h1 className="title">Agregar usuario</h1>
        <div className="mx-auto xl:w-6/12">
          <UserForm
            handlePost={(data) => {
              if (callback) callback(data);
            }}
          />
        </div>
      </div>
    </Wrapper>
  );
}
