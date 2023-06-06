// (c) Delta Software 2023, rights reserved.

import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import ModalPasswordReset from "../components/forms/ModalPasswordReset";
import ProfileForm from "../components/forms/ProfileForm";
import Wrapper from "../containers/Wrapper";
import useAxios from "../hooks/useAxios";
import useModal from "../hooks/useModal";
import { useUrlFile } from "../lib/files";
import { ILink, IUser } from "../types";

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const { response: user } = useAxios<IUser>({
    url: `user/${id}`,
    method: "GET",
  });
  const { response, error, callback } = useAxios<IUser>({
    url: `user/update/${id}`,
    method: "POST",
  });
  const {
    response: responseLink,
    error: errorLink,
    callback: postLink,
  } = useAxios<ILink>({
    url: `user/add-link/${id}`,
    method: "POST",
  });
  const {
    response: responseModifyLink,
    error: errorModifyLink,
    callback: modifyLink,
  } = useAxios<ILink>({
    url: `user/edit-link`,
    method: "POST",
  });
  const {
    response: responseDeleteLink,
    error: errorDeleteLink,
    callback: deleteLink,
  } = useAxios({
    url: `user/delete-link`,
    method: "DELETE",
  });
  const {
    response: resetPasswordResponse,
    error: errorResetPassword,
    callback: resetPassword,
  } = useAxios({
    url: `user/reset-password`,
    method: "POST",
  });
  const { response: links, callback: updateLinks } = useAxios<{
    links: ILink[];
  }>({
    url: `user/links/${id}`,
    method: "GET",
  });

  const {
    isOpen: isOpenPasswordResetForm,
    toggleModal: togglePasswordResetForm,
  } = useModal();
  const navigate = useNavigate();
  const fileUrl = useUrlFile();

  useEffect(() => {
    if (response && user) {
      Swal.fire({
        title: "¡Éxito!",
        text: "El usuario se ha modificado correctamente.",
        icon: "success",
      });
      if (user.rolesString === "regular") {
        navigate(`/my-profile`);
      } else {
        navigate(`/members`);
      }
    } else if (error) {
      Swal.fire({
        title: "¡Error!",
        text: `Ocurrió un error al modificar al usuario.\n
        ${(error as any).response.data.message}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }, [response, error, navigate]);

  useEffect(() => {
    if (resetPasswordResponse) {
      Swal.fire({
        title: "¡Éxito!",
        text: "Se ha reseteado la contraseña exitosamente.",
        icon: "success",
      });
    } else if (errorResetPassword) {
      Swal.fire({
        title: "¡Error!",
        text: `Ocurrió un error al resetear la contraseña.\n
        ${(error as any).response.data.message}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }, [resetPasswordResponse, errorResetPassword, navigate]);

  useEffect(() => {
    if (responseLink || responseModifyLink || responseDeleteLink) {
      Swal.fire({
        title: "¡Éxito!",
        text: "El cambio a la lista de links se ha realizado correctamente.",
        icon: "success",
      });
      updateLinks();
    } else if (errorLink) {
      Swal.fire({
        title: "¡Error!",
        text: `Ocurrió un error al añadir el  link.\n
        ${(errorLink as any).response.data.message}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    } else if (errorModifyLink) {
      Swal.fire({
        title: "¡Error!",
        text: `Ocurrió un error al editar el link.\n
        ${(errorModifyLink as any).response.data.message}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    } else if (errorDeleteLink) {
      Swal.fire({
        title: "¡Error!",
        text: `Ocurrió un error al borrar el link.\n
        ${(errorDeleteLink as any).response.data.message}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }, [
    responseLink,
    errorLink,
    responseModifyLink,
    errorModifyLink,
    responseDeleteLink,
    errorDeleteLink,
  ]);

  return (
    <Wrapper>
      <div>
        {user && links && (
          <ProfileForm
            handlePost={({ form, file }) => {
              if (file) {
                const formData: FormData = new FormData();
                if (typeof file === "string") formData.append("imageUrl", file);
                else formData.append("file", file);
                formData.append("name", form.name.toString());
                formData.append(
                  "lastName",
                  form.lastName?.toString() as string,
                );
                formData.append("email", form.email?.toString() as string);
                formData.append("mobile", form.mobile?.toString() as string);
                formData.append("CUA", form.CUA?.toString() as string);
                formData.append(
                  "urlPP200",
                  form.urlPP200?.toString() as string,
                );
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
            }}
            initialUser={{
              ...user,
              imageUrl: fileUrl(user.imageUrl as string),
            }}
            onTogglePassword={togglePasswordResetForm}
            handleLinkDelete={(idLink) => {
              deleteLink?.({ id: idLink });
            }}
            handleLinkPost={({ link, name }) => {
              postLink?.({ link, name });
            }}
            handleLinkEdit={({ link, name, id: idLink }) => {
              modifyLink?.({ link, name, idLink });
            }}
            links={links.links}
          />
        )}
        <ModalPasswordReset
          isOpenModal={isOpenPasswordResetForm}
          closeModal={togglePasswordResetForm}
          handlePost={(confirmationPassword, password) => {
            if (!password) {
              Swal.fire({
                title: "¡Error!",
                text: "Ingresa una nueva contraseña",
                icon: "error",
              });
              return;
            }
            if (!confirmationPassword) {
              Swal.fire({
                title: "¡Error!",
                text: "Confirma la nueva contraseña",
                icon: "error",
              });
              return;
            }
            const email = user?.email;
            resetPassword?.({ email, password });
            togglePasswordResetForm();
          }}
        />
      </div>
    </Wrapper>
  );
}
