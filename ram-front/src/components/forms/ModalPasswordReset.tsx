// (c) Delta Software 2023, rights reserved.
import { useRef } from "react";
import Modal from "../generics/Modal";
import { FiEye, FiEyeOff } from "react-icons/fi";
import usePasswordVisibility from "../../hooks/usePasswordVisibility";
import Swal from "sweetalert2";

export interface IModalPasswordResetProps {
  handlePost: (confirmationPassword: string, password: string) => void;
  closeModal: VoidFunction;
  isOpenModal: boolean;
}

export default function ModalPasswordReset({
  handlePost,
  closeModal,
  isOpenModal,
}: IModalPasswordResetProps) {
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmationRef = useRef<HTMLInputElement>(null);

  const { handlePasswordVisibility, typeInput, passwordVisible } =
    usePasswordVisibility();

  const {
    handlePasswordVisibility: handlePasswordVisibilityConfirm,
    typeInput: typeInputConfirm,
    passwordVisible: passwordVisibleConfirm,
  } = usePasswordVisibility();
  return (
    <>
      {isOpenModal && (
        <Modal
          withModal={false}
          closeModal={() => {
            closeModal();
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className=" relative w-1/3 rounded-3xl bg-gnp-white p-10"
          >
            <h1 className="apply w-full rounded-xl bg-gnp-orange-500 p-4 text-center text-2xl font-semibold text-white">
              Reestablecer contraseña
            </h1>

            <div className="mt-10 grid grid-cols-2">
              <div className="col-span-2">
                <label className="ml-2 text-xl font-semibold">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <input
                    className="input-primary pr-10"
                    type={typeInput()}
                    name="password"
                    ref={passwordRef}
                  />
                  <button
                    type="button"
                    onClick={handlePasswordVisibility}
                    className="absolute right-[4%] top-4 focus:outline-none"
                  >
                    {passwordVisible ? (
                      <FiEye size={20} color="#012356" />
                    ) : (
                      <FiEyeOff size={20} color="#012356" />
                    )}
                  </button>
                </div>
              </div>
              <div className="col-span-2">
                <label className="ml-2 text-xl font-semibold">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <input
                    className="input-primary pr-10"
                    type={typeInputConfirm()}
                    name="password"
                    ref={confirmationRef}
                  />
                  <button
                    type="button"
                    onClick={handlePasswordVisibilityConfirm}
                    className="absolute right-[4%] top-4 focus:outline-none"
                  >
                    {passwordVisibleConfirm ? (
                      <FiEye size={20} color="#012356" />
                    ) : (
                      <FiEyeOff size={20} color="#012356" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-10 grid grid-cols-2">
              <div className="flex flex-col items-center">
                <div className="w-4/5">
                  <button
                    className="btn-border"
                    onClick={() => {
                      closeModal();
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-4/5">
                  <button
                    className="btn-primary"
                    onClick={() => {
                      if (
                        passwordRef.current &&
                        passwordRef.current?.value?.length >= 8
                      ) {
                        if (
                          passwordRef.current &&
                          confirmationRef.current &&
                          passwordRef.current.value.toString() ===
                            confirmationRef.current.value.toString()
                        ) {
                          const password = passwordRef.current.value.toString();
                          const confirmationPassword =
                            confirmationRef.current?.value.toString();
                          handlePost(confirmationPassword, password);
                        } else {
                          Swal.fire({
                            title: "¡Error!",
                            text: "Las contraseñas no coinciden",
                            icon: "error",
                            confirmButtonText: "OK",
                          });
                        }
                      } else {
                        Swal.fire({
                          title: "¡Error!",
                          text: "La contraseña debe tener al menos 8 caracteres",
                          icon: "error",
                          confirmButtonText: "OK",
                        });
                      }
                    }}
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
