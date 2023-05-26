// (c) Delta Software 2023, rights reserved.

import { useParams } from "react-router-dom";
import Wrapper from "../containers/Wrapper";
import ProfileForm from "../components/forms/ProfileForm";
import useAxios from "../hooks/useAxios";
import { IUser } from "../types";
import useModal from "../hooks/useModal";
import Swal from "sweetalert2";
import ModalPasswordReset from "../components/forms/ModalPasswordReset";

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const { response: user } = useAxios<IUser>({
    url: `user/${id}`,
    method: "GET",
  });
  const {
    isOpen: isOpenPasswordResetForm,
    toggleModal: togglePasswordResetForm,
  } = useModal();

  return (
    <Wrapper>
      <div>
        {user && (
          <ProfileForm
            handlePost={() => {
              alert("Cambiando perfil...");
            }}
            initialUser={{ ...user }}
            onTogglePassword={togglePasswordResetForm}
          />
        )}
        <ModalPasswordReset
          isOpenModal={isOpenPasswordResetForm}
          closeModal={togglePasswordResetForm}
          handlePost={(confirmationPassword, password) => {
            if (!password) {
              Swal.fire({
                title: "Contraseña faltante",
                text: "Ingresa una nueva contraseña",
                icon: "error",
              });
              return;
            }
            if (!confirmationPassword) {
              Swal.fire({
                title: "Confirmación faltante",
                text: "Ingresa la confirmación de la nueva contraseña",
                icon: "error",
              });
              return;
            }
            alert(
              `Cambiando contraseña... ${password} ${confirmationPassword}`,
            );
            togglePasswordResetForm();
          }}
        />
      </div>
    </Wrapper>
  );
}
