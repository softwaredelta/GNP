// (c) Delta Software 2023, rights reserved.

import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { IUser } from "../../types";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import usePasswordVisibility from "../../hooks/usePasswordVisibility";

const defaultValues: IUser = {
  id: "",
  name: "",
  email: "",
  lastName: "",
  password: "",
  mobile: 1000000000,
  confirmPassword: "",
  role: "regular",
  urlPP200: "",
};

export interface IModalProspectFormProps {
  handlePost: (data: IUser) => void;
}
export default function UserForm({ handlePost }: IModalProspectFormProps) {
  const { register, reset, handleSubmit, watch } = useForm<IUser>();

  const { handlePasswordVisibility, typeInput, passwordVisible } =
    usePasswordVisibility();
  const {
    handlePasswordVisibility: handlePasswordVisibilityConfirm,
    typeInput: typeInputConfirm,
    passwordVisible: passwordVisibleConfirm,
  } = usePasswordVisibility();

  return (
    <div className=" grid w-full  grid-cols-3 gap-4">
      <div>
        <label htmlFor="name" className="label-primary ">
          Nombre
        </label>
        <input
          type="text"
          id="name"
          className="input-primary"
          {...register("name", {
            required: "El campo nombre es requerido",
          })}
        />
      </div>
      <div>
        <label htmlFor="lastName" className="label-primary ">
          Apellidos
        </label>
        <input
          type="text"
          id="lastName"
          className="input-primary"
          {...register("lastName", {
            required: "El campo apellidos es requerido",
          })}
        />
      </div>
      <div>
        <label htmlFor="email" className="label-primary ">
          Email
        </label>
        <input
          className="input-primary"
          type="email"
          {...register("email", {
            required: "El campo email es requerido",
          })}
        />
      </div>
      <div>
        <label htmlFor="mobile" className="label-primary ">
          Celular
        </label>
        <input
          className="input-primary"
          type="number"
          {...register("mobile", {
            required: "El campo Celular es requerido",
            maxLength: {
              value: 10,
              message: "El número de celular debe tener 10 dígitos",
            },
            minLength: {
              value: 10,
              message: "El número de celular debe tener 10 dígitos",
            },
          })}
        />
      </div>

      <div className="relative justify-center">
        {/* <div> */}
        <label htmlFor="password" className="label-primary ">
          Contraseña
        </label>
        <input
          className="input-primary"
          type={typeInput()}
          {...register("password", {
            required: "La contraseña es requerida",
            minLength: {
              value: 8,
              message: "La contraseña debe tener al menos 8 caracteres",
            },
          })}
        />
        <button
          type="button"
          onClick={handlePasswordVisibility}
          className="absolute right-[15%] top-14 focus:outline-none"
        >
          {passwordVisible ? (
            <AiFillEye size={20} color="#012356" />
          ) : (
            <AiFillEyeInvisible size={20} color="#012356" />
          )}
        </button>
      </div>
      <div className="relative justify-center">
        <label htmlFor="confirmPassword" className="label-primary ">
          Confirmar Contraseña{" "}
        </label>
        <input
          className="input-primary"
          type={typeInputConfirm()}
          {...register("confirmPassword", {
            required: "La confirmación de contraseña es requerida",
            validate: (value) =>
              value === watch("password") || "Las contraseñas no coinciden",
          })}
        />
        <button
          type="button"
          onClick={handlePasswordVisibilityConfirm}
          className="absolute right-[15%] top-14 focus:outline-none"
        >
          {passwordVisibleConfirm ? (
            <AiFillEye size={20} color="#012356" />
          ) : (
            <AiFillEyeInvisible size={20} color="#012356" />
          )}
        </button>
      </div>
      <div>
        <label htmlFor="pp200" className="label-primary ">
          Url del PP200
        </label>
        <input
          className="input-primary"
          type="text"
          {...register("urlPP200")}
        />
      </div>
      <div>
        <label htmlFor="role" className="label-primary ">
          Rol
        </label>
        <select
          className="input-primary "
          {...register("role", { required: "El rol es requerido" })}
        >
          <option value="regular">Agente</option>
          <option value="manager">Gerente</option>
        </select>
      </div>
      <div className="col-span-3">
        <div className="mx-auto w-8/12">
          <button
            onClick={handleSubmit(
              (data) => {
                handlePost(data);
                reset(defaultValues);
              },
              (errorsFields) => {
                Swal.fire({
                  title: "Error!",
                  text: `Ocurrió un error al registrar la venta.\n
                  ${Object.values(errorsFields).map((e) => e.message + " ")}`,
                  icon: "error",
                  confirmButtonText: "OK",
                });
              },
            )}
            className="btn-primary"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
